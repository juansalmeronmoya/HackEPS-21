import {useState, useRef, useEffect} from "react";
import { useParams } from "react-router-dom";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import Draggable from 'react-draggable';

const colorcitos = ['white', 'red', 'blue', '#fabada', 'violet', 'olive', 'black', 'brown', 'green']

const Ball = (props) => {
  return <div
    className={'triangle'}
    style={{border: '1.5px solid black', borderRadius: '50%', top: props.top, left:props.left, width: 8, height: 8, position:"absolute", backgroundColor: props.color}}
  >
   <span style={{fontSize: 10}}> {props.name} </span>
  </div>
}
const Cursor = (props) => {
  const [mapValue, setMapValue] = useState(Array.from(props.sharedMap.entries()))

  useEffect(() => {
    props.sharedMap.observeDeep(() => {
      setMapValue(Array.from(props.sharedMap.entries()))
    })
    return () => {}
  }, []);

  const handleMouseMove = (e) => {
    props.sharedMap.set(props.id, {x:e.clientX, y:e.clientY})
  };

  return(
    <div className={'page'} onMouseMove={handleMouseMove}>
      <div style={{position: "absolute", left: 0, top: 0, width: 200, height: '100vh', backgroundColor: '#BDBDBD55'}}>
        {mapValue.map((m, key) =>
          m[0] !== props.id ?
            <>
              <Ball name={m[0]} key={key} top={m[1]?.y} left={m[1]?.x} color={colorcitos[key]}/>
              <div style={{maxWidth: '150px', display: 'flex', justifyContent: 'space-between', marginLeft: 20, marginTop: 20, textAlign: 'left', fontWeight: 400}} key={key}>
                {m[0]} <div style={{marginLeft: 10, borderRadius:'50%', height:20, width:20, backgroundColor:colorcitos[key]}}/>
              </div>
            </>
            :
            <div style={{marginLeft: 20, marginTop: 20, textAlign: 'left', fontWeight: 600}}>{m[0]}</div>)}}
      </div>

    </div>)
}

const Images = (props) => {
  const [mapValue, setMapValue] = useState(Array.from(props.sharedMap.entries()))
  const [text, setText] = useState('')

  useEffect(() => {
    props.sharedMap.observeDeep(() => {
      console.log(Array.from(props.sharedMap.entries()))
      setMapValue(Array.from(props.sharedMap.entries()))
    })
    return () => {}
  }, []);

  const handlerOnDrag = (e, url) => {
    props.sharedMap.set(url, {x:e.clientX-100, y:e.clientY-100, url: url})
    props.sharedSec.set(props.id, {x:e.clientX, y:e.clientY})
  };

  return(
    <div>
    <div style={{
      position: 'sticky',
      top: 0,
      padding: '20px',
      textAlign: 'center',
      fontSize: '20px'}}>
      <form>
        <label> IMG URL </label>
        <input value={text} onChange={(e) => {setText(e.currentTarget.value)}}/>
        <input
          onClick={() => {
            props.sharedMap.set(text, {x: 90, y:40, url: text})
          }}
          type="button"
          value="Submit"/>
      </form>
    </div>
      {mapValue.map((m, key) => {
        console.log('important', m)
        return (
          <Draggable
            key={key}
            position={{x: m[1]?.x, y: m[1]?.y}}
            scale={1}
            onDrag={(e) => { handlerOnDrag(e, m[1]?.url)}}>
            <div>
              <img
                width={200}
                height={200}
                src={m[1]?.url}/>
            </div>
          </Draggable>
        )
      })}
    </div>
  )
}

const App = () => {
  const doc = useRef(new Y.Doc()).current;
  const {room, id} = useParams();
  const sharedCursorMap = useRef(doc.getMap('cursor')).current
  const sharedDragMap = useRef(doc.getMap('drag')).current

  useEffect(() => {
    const a = new WebrtcProvider(room, doc);
    sharedCursorMap.set(id, {x: -200, y: -200})
    window.addEventListener("beforeunload", (ev) => {
      ev.preventDefault();
      return sharedCursorMap.delete(id)
    });
    return () => {
      sharedCursorMap.delete(id)
      a.disconnect();
    }
  }, []);


  return (
    <>
      <Images id={id} sharedMap={sharedDragMap} sharedSec={sharedCursorMap}/>
      <Cursor id={id} sharedMap={sharedCursorMap}/>
    </>
  )
}

export default App


