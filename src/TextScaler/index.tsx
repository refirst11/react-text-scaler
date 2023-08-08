import React, { useState, useRef, useCallback, useEffect } from 'react'
import styles from './styles.module.css'

type TextScalerProps = {
  target: string
  size: number
  pathname?: string
  className?: string
  classBox?: string
  classSlider?: string
}

// Main functional,
// this project of size variable is all font size value.
export const TextScaler = ({
  target,
  size,
  pathname,
  className,
  classBox,
  classSlider
}: TextScalerProps) => {
  const refParent = useRef<HTMLDivElement>(null)
  const refSwipe = useRef<HTMLDivElement>(null)
  const [sizes, setSizes] = useState<number[]>([])
  const [initialSize, setInitialSize] = useState(0)
  const [initialX, setInitialX] = useState(0)
  const [touchStartX, setTouchStartX] = useState(0)
  const [entryCount, setEntryCount] = useState(0)
  const [applyCount, setApplyCount] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [hasMoving, setHasMoving] = useState(false)

  // this is a calucration a variables.
  const offset = initialSize - 10
  const offsetFactor = 1 / initialSize
  const scaleFactor = 100 / size
  const fontSizeRatio = (1 / scaleFactor) * offsetFactor
  const maxCountSize = size + initialSize
  const minValue = -offset
  const maxValue = size >= 14 ? size - offset : size
  const exception = `:not(.${styles.parent} *)`

  // The Core functional.
  const handleSetCount = useCallback(
    (delta: number) => {
      setEntryCount(prevCount => {
        // this is handle the delta of handle as threshold, one step is 1px with fontSizeRatio.
        const clampedValue = Math.max(
          prevCount + delta * fontSizeRatio,
          -initialSize / 5
        )

        // count is passed to the useLayoutEffect as variable in scale.
        return Math.min(Math.max(clampedValue, minValue), maxValue)
      })
    },
    [fontSizeRatio, initialSize, maxValue, minValue]
  )

  // This calculation refreshing as static render.
  useEffect(() => {
    setEntryCount(0)
  }, [pathname])

  useEffect(() => {
    const elements = document.querySelectorAll(target + ' *' + exception)
    const fontSizeArray = []

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]
      const computedStyle = getComputedStyle(element)
      const fontSize = parseFloat(computedStyle.fontSize)
      fontSizeArray.push(isNaN(fontSize) ? 14 : fontSize)
    }

    setSizes(fontSizeArray)
  }, [exception, pathname, target])

  // The scaling the sizes values individually set a value.
  useEffect(() => {
    const scale = 1 + entryCount / 10 // use the entryCount variable.
    const elements = document.querySelectorAll(target + ' *' + exception)

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i] as HTMLElement
      const initialFontSize = sizes[i]
      let scaleFontSize = initialFontSize * scale

      if (scaleFontSize <= 10) scaleFontSize = 10

      scaleFontSize = Math.min(scaleFontSize, maxCountSize)
      element.style.setProperty('font-size', Math.round(scaleFontSize) + 'px')
      console.log(Math.floor(scaleFontSize))
    }

    const body = document.querySelector('body') as HTMLElement
    const computedStyleBody = getComputedStyle(body)
    const bodySize = parseFloat(computedStyleBody.fontSize)
    setInitialSize(bodySize) // mount the initialSize as factors calucration.

    return setApplyCount(Math.round(Math.min(bodySize * scale, maxCountSize)))
  }, [exception, entryCount, maxCountSize, sizes, target])

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0]
    setVisible(true)
    setHasMoving(false)
    setTouchStartX(touch.clientX)
  }, [])

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (applyCount <= maxCountSize) {
        const touch = e.touches[0]
        const delta = touch.clientX - touchStartX
        handleSetCount(delta * 8)
        setTouchStartX(touch.clientX)
        setHasMoving(true)
      }
    },
    [applyCount, handleSetCount, maxCountSize, touchStartX]
  )

  const handleReset = useCallback(() => {
    setVisible(false)
    !hasMoving && setEntryCount(0)
  }, [hasMoving])

  const handleMouseDown = useCallback((e: MouseEvent) => {
    setIsDragging(true)
    setVisible(true)
    setHasMoving(false)
    setInitialX(e.clientX)
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && applyCount <= maxCountSize) {
        const delta = e.clientX - initialX
        handleSetCount(delta * 8)
        setInitialX(e.clientX)
        setHasMoving(true)
      }
    },
    [applyCount, handleSetCount, initialX, isDragging, maxCountSize]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setVisible(false)
  }, [])

  // The entry of core handlers.
  useEffect(() => {
    const controle = refParent.current as HTMLDivElement
    const box = refSwipe.current as HTMLDivElement

    controle.addEventListener('touchstart', handleTouchStart)
    box.addEventListener('touchmove', handleTouchMove)
    controle.addEventListener('touchend', handleReset)

    controle.addEventListener('mouseup', handleReset)
    controle.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      // mobile handle.
      controle.removeEventListener('touchstart', handleTouchStart)
      box.removeEventListener('touchmove', handleTouchMove)
      controle.removeEventListener('touchend', handleReset)

      // desktop handle.
      controle.removeEventListener('mouseup', handleReset)
      controle.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleReset,
    handleTouchMove,
    handleTouchStart
  ])

  // The controll start or end.
  useEffect(() => {
    document.body.style.cursor = isDragging ? 'grabbing' : 'auto'

    const enterControll = (e: Event) => {
      e.preventDefault()
      document.body.style.overflow = 'hidden'
    }

    const leaveControll = () => {
      document.body.style.overflow = 'auto'
    }

    const controle = refParent.current as HTMLDivElement
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
  }, [isDragging])

  const [visible, setVisible] = useState(false)

  // entry classes group.
  const classesPparent = className + ' ' + styles.parent
  const classesBox = classBox + ' ' + styles.box

  const classesView =
    styles.center + ' ' + (visible ? styles.visible : styles.hidden)

  // The return the next React component.
  return (
    <div draggable="false" ref={refParent} className={classesPparent}>
      {!visible && <div className={classesBox}>T</div>}
      {visible && (
        <div className={styles.counter}>
          {applyCount}
          <span className={styles.px}>px</span>
        </div>
      )}
      <div ref={refSwipe} className={classesView}>
        <span
          className={styles.sizeSmallT}
          style={{ marginRight: visible ? 8 : 0 }}
        >
          T
        </span>
        <div className={classSlider} />
        <span
          className={styles.sizeBigT}
          style={{ marginLeft: visible ? 8 : 0 }}
        >
          T
        </span>
      </div>
    </div>
  )
}
