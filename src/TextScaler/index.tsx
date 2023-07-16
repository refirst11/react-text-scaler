import React, {
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
  useEffect
} from 'react'
import styles from './styles.module.css'

type TextScalerProps = {
  pathname: string
  target: string
  sliderColor?: string
  sliderBorderColor?: string
  handleColor?: string
  handleBorderColor?: string
}

export const TextScaler = ({
  pathname,
  target,
  sliderColor,
  sliderBorderColor,
  handleColor,
  handleBorderColor
}: TextScalerProps) => {
  const [count, setCount] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [initialX, setInitialX] = useState(0)
  const [touchStartX, setTouchStartX] = useState(0)
  const handleSetCount = (delta: number) => {
    setCount(prevCount => {
      const newValue = prevCount + delta * 0.25
      const clampedValue = Math.min(Math.max(newValue, -4), 4)
      return clampedValue
    })
  }

  const ref1 = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)

  const [fontSizes, setFontSizes] = useState<number[]>([])

  useEffect(() => {
    setCount(0)
  }, [pathname])

  useEffect(() => {
    const elements = document.querySelectorAll(target + ' *')
    const fontSizeArray = []

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]
      const computedStyle = getComputedStyle(element)
      const fontSizeInPx = parseFloat(computedStyle.fontSize)
      fontSizeArray.push(isNaN(fontSizeInPx) ? 14 : fontSizeInPx)
    }

    setFontSizes(fontSizeArray)
  }, [pathname, target])

  useLayoutEffect(() => {
    const elements = document.querySelectorAll(target + ' *')
    if (elements)
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i] as HTMLElement
        const fontSizeInPx = fontSizes[i] + count
        element.style.setProperty(
          'font-size',
          fontSizeInPx < 10 ? '10px' : fontSizeInPx + 'px'
        )
      }
  }, [count, fontSizes, target])

  const handleWheel = useCallback((e: WheelEvent) => {
    const delta = e.deltaY * 0.1
    handleSetCount(-delta)
  }, [])

  const enterControll = (e: Event) => {
    e.preventDefault()
    document.body.style.overflow = 'hidden'
  }

  const leaveControll = () => {
    document.body.style.overflow = 'auto'
  }

  const handleMouseDown = useCallback((e: MouseEvent) => {
    setIsDragging(true)
    setInitialX(e.clientX)
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouse = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const delta = e.clientX - initialX
        handleSetCount(delta)
        setInitialX(e.clientX)
      }
    },
    [isDragging, initialX]
  )

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0]
    setTouchStartX(touch.clientX)
  }

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0]
      const delta = touch.clientX - touchStartX
      handleSetCount(delta)
      setTouchStartX(touch.clientX)
    },
    [touchStartX]
  )

  useEffect(() => {
    const elmHandle = ref1.current
    const elmBox = ref2.current
    elmBox?.addEventListener('wheel', handleWheel, { passive: true })
    elmHandle?.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mousemove', handleMouse)
    elmHandle?.addEventListener('touchstart', handleTouchStart)
    elmHandle?.addEventListener('touchmove', handleTouchMove)

    return () => {
      elmBox?.removeEventListener('wheel', handleWheel)
      elmHandle?.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousemove', handleMouse)
      elmHandle?.removeEventListener('touchstart', handleTouchStart)
      elmHandle?.removeEventListener('touchmove', handleTouchMove)
    }
  }, [
    handleMouse,
    handleMouseDown,
    handleMouseUp,
    handleTouchMove,
    handleWheel
  ])

  useEffect(() => {
    const elmBox = ref2.current
    elmBox?.addEventListener('mouseover', enterControll, { passive: false })
    elmBox?.addEventListener('mouseout', leaveControll)
    elmBox?.addEventListener('touchstart', enterControll, { passive: false })
    elmBox?.addEventListener('touchend', leaveControll)

    return () => {
      elmBox?.removeEventListener('mouseover', enterControll)
      elmBox?.removeEventListener('mouseout', leaveControll)
      elmBox?.removeEventListener('touchstart', enterControll)
      elmBox?.removeEventListener('touchend', leaveControll)
    }
  }, [handleMouse, handleMouseDown, handleMouseUp])

  const [visible, setVisible] = useState(false)
  const classes =
    styles.center + ' ' + (visible ? styles.visible : styles.hidden)
  return (
    <>
      <div
        className={styles.t}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        T
        <div ref={ref2} style={{ width: 80, height: 30 }} className={classes}>
          <div
            style={{
              width: 40,
              height: 4,
              background: sliderColor,
              border: '1px solid ' + sliderBorderColor
            }}
            className={styles.slider}
          >
            <div
              ref={ref1}
              style={{
                width: 12,
                height: 12,
                background: handleColor,
                border: '1px solid ' + handleBorderColor,
                transform: `translateX(${count * 4}px)`
              }}
              className={styles.sliderHandle}
            />
          </div>
        </div>
      </div>
    </>
  )
}
