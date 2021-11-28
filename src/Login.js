import {useState} from "react";

const Login = () => {
  const [room, setRoom] = useState('');
  const [user, setUser] = useState('');

  return (
    <div style={{marginLeft: '40%', marginTop: '20%'}}>
      <form>
        <label> ROOM ID: </label>
        <input value={room} onChange={(e) => {setRoom(e.currentTarget.value)}}/>
      </form><form>
      <label> USER ID: </label>
      <input value={user} onChange={(e) => {setUser(e.currentTarget.value)}}/>
    </form>
      <a
        href={'/'+room+'/'+user}
        type="button"
      >
        ENTRAR
      </a>
    </div>
  )
}

export default Login


