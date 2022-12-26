/** @jsx h */
import { JSX, h } from "preact"
import { MutableRef } from "preact/hooks"

import { Loading } from '../Loading/Loading.tsx';


const styles = {
  wrapper: {
    display: 'flex',
    position: 'relative',
    textAlign: 'initial',
  },
  fullWidth: { width: '100%' },
  hide: { display: 'none' },
}


type ContainerProps = {
  width: number | string,
  height: number | string,
  loading: JSX.Element | string,
  isEditorReady: boolean,  
  _ref?: MutableRef<HTMLDivElement>,
  className?: string,
  wrapperProps?: Record<string, unknown>,
}

// ** forwardref render functions do not support proptypes or defaultprops **
// one of the reasons why we use a separate prop for passing ref instead of using forwardref


export function MonacoContainer({
    width,
    height,
    loading,
    isEditorReady,  
    _ref,
    className,
    wrapperProps,
  } : ContainerProps) {
  return (
    <section style={{ ...styles.wrapper, width, height }} {...wrapperProps}>
      {!isEditorReady && <Loading content={loading} />}
      <div
        ref={_ref}
        style={{ ...styles.fullWidth, ...(!isEditorReady && styles.hide) }}
        className={className}
      />
    </section>
  );
}