import React, {
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
  useEffect
} from 'react'
import styles from './styles.module.css'

type SliderProperty = {
  color?: string
  borderColor?: string
  handleColor?: string
  handleBorderColor?: string
}

type TextScalerProps = {
  target: string
  size: number
  pathname?: string
  className?: string
  sliderPosition?: number
  sliderColor?: SliderProperty
}

export const TextScaler = ({
  target,
  size,
  pathname,
  sliderPosition = 64,
  className,
  sliderColor
}: TextScalerProps) => {
  const ref1 = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)
  const ref3 = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [initialX, setInitialX] = useState(0)
  const [touchStartX, setTouchStartX] = useState(0)
  const scaleFactor = 64 / 2 / size
  const fontSizeRatio = 1 / scaleFactor

  const handleSetCount = useCallback(
    (delta: number) => {
      setCount(prevCount => {
        const newValue = prevCount + delta * fontSizeRatio
        const clampedValue = Math.min(Math.max(newValue, -size), size)
        return clampedValue
      })
    },
    [fontSizeRatio, size]
  )

  const handleClickCount = useCallback(
    (val: number) => {
      const clampedValue = Math.min(Math.max(val, -size), size)
      setCount(clampedValue)
    },
    [size]
  )

  const [fontSizes, setFontSizes] = useState<number[]>([])

  useEffect(() => {
    setCount(0)
  }, [pathname])

  useEffect(() => {
    const elements = document.querySelectorAll(target + ' *')
    const text = document.querySelector('.' + styles.t)
    const fontSizeArray = []

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]
      const computedStyle = getComputedStyle(element)
      const fontSizeInPx = parseFloat(computedStyle.fontSize)
      fontSizeArray.push(isNaN(fontSizeInPx) ? 14 : fontSizeInPx)
    }

    if (text) {
      const textComputedStyle = getComputedStyle(text)
      const fontSizeOfText = parseFloat(textComputedStyle.fontSize)
      fontSizeArray.push(isNaN(fontSizeOfText) ? 14 : fontSizeOfText)
    }

    setFontSizes(fontSizeArray)
  }, [pathname, target])

  useLayoutEffect(() => {
    const elements = document.querySelectorAll(target + ' *')
    const text = document.querySelector('.' + styles.t) as HTMLElement
    const scale = 1 + count / 10

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i] as HTMLElement
      const initialFontSize = fontSizes[i]
      const scaleFontSize = initialFontSize * scale
      element.style.setProperty(
        'font-size',
        scaleFontSize < 10 ? '10px' : scaleFontSize + 'px'
      )
    }

    if (text) {
      const initialFontSize = fontSizes[fontSizes.length - 1]
      const scaleFontSize = initialFontSize * scale
      text.style.setProperty(
        'font-size',
        scaleFontSize < 10 ? '10px' : scaleFontSize + 'px'
      )
    }
  }, [count, fontSizes, target])

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      const delta = e.deltaY * 0.1
      handleSetCount(-delta)
    },
    [handleSetCount]
  )

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
    [handleSetCount, initialX, isDragging]
  )

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0]
    setTouchStartX(touch.clientX)
  }, [])

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0]
      const delta = touch.clientX - touchStartX
      handleSetCount(delta)
      setTouchStartX(touch.clientX)
    },
    [handleSetCount, touchStartX]
  )

  const handleSliderMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const sliderBar = e.currentTarget
      const rect = sliderBar.getBoundingClientRect()
      const clickedX = e.clientX - rect.left
      const sliderWidth = sliderBar.clientWidth
      const newValue = (clickedX / sliderWidth - 0.5) * size * 4
      handleClickCount(newValue)
    },
    [handleClickCount, size]
  )

  useEffect(() => {
    const controle = ref1.current as HTMLDivElement
    const box = ref2.current as HTMLDivElement
    const handle = ref3.current as HTMLDivElement
    controle.addEventListener('wheel', handleWheel, { passive: true })
    box.addEventListener('wheel', handleWheel, { passive: true })
    box.addEventListener('mousedown', handleMouseDown)
    box.addEventListener('touchstart', handleTouchStart)
    box.addEventListener('touchmove', handleTouchMove)
    handle.addEventListener('touchstart', handleTouchStart)
    handle.addEventListener('touchmove', handleTouchMove)
    handle.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mousemove', handleMouse)

    return () => {
      controle.removeEventListener('wheel', handleWheel)
      box.removeEventListener('wheel', handleWheel)
      box.removeEventListener('mousedown', handleMouseDown)
      box.removeEventListener('touchstart', handleTouchStart)
      box.removeEventListener('touchmove', handleTouchMove)
      handle.removeEventListener('touchstart', handleTouchStart)
      handle.removeEventListener('touchmove', handleTouchMove)
      handle.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousemove', handleMouse)
    }
  }, [
    handleWheel,
    handleMouseDown,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleMouse
  ])

  useEffect(() => {
    const controle = ref1.current as HTMLDivElement
    controle.addEventListener('mouseover', enterControll, { passive: false })
    controle.addEventListener('mouseout', leaveControll)
    controle.addEventListener('touchstart', enterControll, { passive: false })
    controle.addEventListener('touchend', leaveControll)

    return () => {
      controle.removeEventListener('mouseover', enterControll)
      controle.removeEventListener('mouseout', leaveControll)
      controle.removeEventListener('touchstart', enterControll)
      controle.removeEventListener('touchend', leaveControll)
    }
  }, [handleMouse, handleMouseDown, handleMouseUp])

  const [visible, setVisible] = useState(false)
  const classes1 = className + ' ' + styles.t
  const classes2 =
    styles.center + ' ' + (visible ? styles.visible : styles.hidden)

  return (
    <div
      ref={ref1}
      className={classes1}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => {
        setVisible(false)

        setIsDragging(false)
      }}
    >
      T
      <div
        onMouseDown={handleSliderMouseDown}
        ref={ref2}
        style={{
          width: visible ? 128 : 0,
          height: visible ? Math.abs(sliderPosition) + 48 : 0
        }}
        className={classes2}
      >
        <div
          style={{
            background: sliderColor?.color,
            border: '1px solid ' + sliderColor?.borderColor,
            marginTop: sliderPosition,
            pointerEvents: visible ? 'auto' : 'none'
          }}
          className={styles.slider}
        >
          <div
            ref={ref3}
            style={{
              background: sliderColor?.handleColor,
              border: '1px solid ' + sliderColor?.handleBorderColor,
              transform: `translateX(${count * scaleFactor}px)`,
              pointerEvents: visible ? 'auto' : 'none'
            }}
            className={styles.sliderHandle}
          />
        </div>
      </div>
    </div>
  )
}
