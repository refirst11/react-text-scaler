import React, {
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
  useEffect
} from 'react'
import styles from './styles.module.css'

type CommonProps = {
  target: string
  size: number
  pathname?: string
  className?: string
  sliderColor?: string
  sliderBorderColor?: string
  handleColor?: string
  handleBorderColor?: string
}

type CenterProps = {
  center: true
  sliderPosition?: never
}

type SliderPositionProps = {
  center?: false
  sliderPosition: number
}

type TextScalerProps = CommonProps & (CenterProps | SliderPositionProps)

export const TextScaler = ({
  target,
  size,
  pathname,
  center = false,
  sliderPosition = 0,
  className,
  sliderColor,
  sliderBorderColor,
  handleColor,
  handleBorderColor
}: TextScalerProps) => {
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

  const ref1 = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)
  const ref3 = useRef<HTMLDivElement>(null)

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
    const tBox = ref1.current
    const elmBox = ref2.current
    const elmHandle = ref3.current
    tBox?.addEventListener('wheel', handleWheel, { passive: true })
    elmBox?.addEventListener('wheel', handleWheel, { passive: true })
    tBox?.addEventListener('mousedown', handleMouseDown)
    elmHandle?.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mousemove', handleMouse)
    tBox?.addEventListener('touchstart', handleTouchStart)
    tBox?.addEventListener('touchmove', handleTouchMove)
    elmHandle?.addEventListener('touchstart', handleTouchStart)
    elmHandle?.addEventListener('touchmove', handleTouchMove)

    return () => {
      tBox?.removeEventListener('wheel', handleWheel)
      elmBox?.removeEventListener('wheel', handleWheel)
      tBox?.removeEventListener('mousedown', handleMouseDown)
      elmHandle?.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousemove', handleMouse)
      tBox?.removeEventListener('touchstart', handleTouchStart)
      tBox?.removeEventListener('touchmove', handleTouchMove)
      elmHandle?.removeEventListener('touchstart', handleTouchStart)
      elmHandle?.removeEventListener('touchmove', handleTouchMove)
    }
  }, [
    handleMouse,
    handleMouseDown,
    handleMouseUp,
    handleTouchMove,
    handleTouchStart,
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
  const classes1 = className + ' ' + styles.t
  const classes2 =
    styles.center + ' ' + (visible ? styles.visible : styles.hidden)

  return (
    <div
      ref={ref1}
      className={classes1}
      style={{
        boxShadow:
          center && visible ? 'none' : '0 0 2px -0.4px var(--color-shadow)'
      }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => {
        setVisible(false)
        setIsDragging(false)
      }}
    >
      {sliderPosition ? 'T' : !visible && 'T'}
      <div
        onMouseDown={handleSliderMouseDown}
        ref={ref2}
        style={{
          width: visible ? 128 : 0,
          height: visible ? (!center ? Math.abs(sliderPosition) : 64) : 0
        }}
        className={classes2}
      >
        <div
          style={{
            width: 64,
            height: 5,
            background: sliderColor,
            border: '1px solid ' + sliderBorderColor,
            marginTop: sliderPosition,
            pointerEvents: visible ? 'auto' : 'none'
          }}
          className={styles.slider}
        >
          <div
            ref={ref3}
            style={{
              width: 16,
              height: 16,
              background: handleColor,
              border: '1px solid ' + handleBorderColor,
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
