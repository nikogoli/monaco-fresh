/** @jsxRuntime classic */
/** @jsx h */
import { JSX, h } from "https://esm.sh/preact@10.10.6"

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