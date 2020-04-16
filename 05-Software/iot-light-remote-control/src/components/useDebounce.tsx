import { useState, useEffect, useCallback } from 'react';


// export default function useDebounce(callback = () => {}, ms = 300) {
//     const [startLongPress, setStartLongPress] = useState(false);
  
//     useEffect(() => {
//       let timerId: any;
//       if (startLongPress) {
//         timerId = setInterval(callback, ms);
//       } else {
//         clearInterval(timerId);
//       }
  
//       return () => {
//         clearInterval(timerId);
//       };
//     }, [startLongPress]);
  
//     return {
//       onMouseDown: () => setStartLongPress(true),
//       onMouseUp: () => setStartLongPress(false),
//       onMouseLeave: () => setStartLongPress(false),
//       onTouchStart: () => setStartLongPress(true),
//       onTouchEnd: () => setStartLongPress(false),
//     };
//   }



export default function useDebounce(callback = (ev: any) => {}, ms = 300) {
    const [pressEvent, setStartLongPress] = useState({isPressed: false, event: {}});
  
    useEffect(() => {
      let timerId: any;
      if (pressEvent.isPressed) {
        callback(pressEvent.event);
        // timerId = setInterval(()=>callback(pressEvent.event), ms);
      } else {
        clearInterval(timerId);
      }
  
      return () => {
        clearInterval(timerId);
      };
    }, [pressEvent]);
  
    return {
      onMouseDown: (e: any) => setStartLongPress({isPressed: true, event: e}),
      onMouseUp: (e: any) => setStartLongPress({isPressed: false, event: e}),
      onMouseLeave: (e: any) => setStartLongPress({isPressed: false, event: e}),
      onTouchStart: (e: any) => {e.persist();setStartLongPress({isPressed: true, event: e})},
      onTouchMove: (e: any) => {e.persist();setStartLongPress({isPressed: true, event: e})},
      onTouchEnd: (e: any) => {e.persist();setStartLongPress({isPressed: false, event: e})},
    };
  }