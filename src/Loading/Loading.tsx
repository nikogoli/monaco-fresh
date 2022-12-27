/** @jsxRuntime classic */
/** @jsx h */
import { JSX, h } from "preact"

const loadingStyles = {
  display: 'flex',
  height: '100%',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
};

export function Loading(props:{ content: JSX.Element | string }) {
  return (
    <div style={loadingStyles}>{props.content}</div>
  );
}