import { useEffect } from 'react';
import { useEditorStore } from './editorStore';

export function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

export default function useWindowDimensions() {
  const setDimensions = useEditorStore.use.setDimensions()
  const setDesktopView = useEditorStore.use.setDesktopView()

  useEffect(() => {
    function handleResize() {
      const newDimensions = getWindowDimensions();
      setDimensions(newDimensions);
      setDesktopView(newDimensions.width >= 1024)
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // called once on mount
}
