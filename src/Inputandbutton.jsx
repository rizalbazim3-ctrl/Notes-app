  import { useEffect, useState } from 'react'
  import axios from "axios"

  function Inputandbutton() {
    const [addbutton, setAddbutton] = useState("Add")

    const [title, setTitle] = useState("")

    const [note, setNote] = useState("")

    const [items, setItems] = useState([])

    const [isediting, setIsediting] = useState(false)

    const [editindex, setEditindex] = useState("")

    const [showArchive, setShowArchive] = useState(false)

    const [showpin, setShowpin] = useState(false)

    useEffect(() =>{ 
      axios.get("http://localhost:3000/notes")
      .then((response) => setItems(response.data))
      .catch((error) => console.log("hey" + error))
    },[]);

    const handletitle = (event) => {
      setTitle(event.target.value)
    }

    const handleinput = (event) => {
      setNote(event.target.value)
    }

    const handleadd = () => {
      setAddbutton("Add")

      if (note === "" && title === "") {
        alert("The note is empty")
      } else if (isediting) {

        const update = items.map((item) =>
          item.id === editindex ? {...item ,title,note} : item
        )
        const updated = update.find((item) => item.id === editindex )
        console.log(updated)
        axios.patch(`http://localhost:3000/notes/${editindex}`,updated)
        
      
        setEditindex("")
        setIsediting(false)

        setNote("")
        setTitle("")

      }
      else if (note.trim() !== "" && title.trim() !== "") {

        const newnotes = { title, note, archive: false, showpin: false }

        
          axios.post("http://localhost:3000/notes",newnotes)
        
          setNote("")
          setTitle("")
          console.log(items)

      } else if (title === "") {
        alert("add title")

      } else if (note === "") {
        alert("add note")
      }
    

    }
    const handledelete = (itemId) => {

      const deleted = items.filter((value) =>   itemId == value.id )
      
      axios.delete(`http://localhost:3000/notes/${itemId}`)
    }
    
    const handleedit = (indextoedit,editId) => {
      setTitle(items[indextoedit].title)
      setNote(items[indextoedit].note)
      setAddbutton("Save")
      setEditindex(editId)
      setIsediting(true)

    }
    const handlearchive = (indexofarchive,id) => {
      const update = items.map((item, position) =>
        position === indexofarchive ? { ...item, archive: true } : item
      )
    const updated = update.find((item) => item.id === id )

    axios.patch(`http://localhost:3000/notes/${id}`,updated)
    
    }

    const handleunarchive = (indexofarchive,id) => {
      const update = items.map((item, position) =>
        position === indexofarchive ? { ...item, archive: false } : item
      )
      const updated = update.find((item) => item.id === id )

      axios.patch(`http://localhost:3000/notes/${id}`,updated)
    }

    const handleshowpin = (indexofpin) => {
      console.log(indexofpin);
      console.log(items);
      
      const updated = items.map((item, index) =>
        index === indexofpin ? { ...item , showpin : !item.showpin} : item)
      
      const pinnote = updated.filter((item) =>
        item.showpin)
    
      const unpinnote = updated.filter((item) =>
        !item.showpin)
      
      const fullnote = [...pinnote, ...unpinnote]

      console.log(fullnote);
      
      setItems(fullnote)

      console.log(items)
    }

    return (
      <>
      <div className=" mt-10 mx-auto  max-w-xl border rounded-3xl p-4 bg-gray-00 m-6  shadow-[0_0_20px_rgba(124,58,237,0.15)]">
        <h1 className='mb-4 font-bold text-3xl text-blue-500 '>📝 My Notes</h1>
        <hr className='text-gray-500 pb-3'></hr>
        <div className='pb-3'>
          <button className="border-2 rounded-lg bg-black text-white "
            onClick={() => {
              setShowArchive(false)
            }}>
            &nbsp;&nbsp;&nbsp;Notes&nbsp;&nbsp;&nbsp;</button>
          <button className="border-2 rounded-lg bg-white "
            onClick={() => {
              setShowArchive(true)
            }}>Archives</button>
        </div>
        <div>
          <input type="text" className=" hover:-translate-x-1 duration-500 pl-2 text-gray-300 w-full border border-gray-700 rounded-lg hover:bg-purple-800/30 bg-gray-900" placeholder="  Title"
            value={title} onChange={handletitle} />
          <br/>
          <textarea
            type="text" className="hover:-translate-x-1 duration-500  pl-2 text-gray-300 w-full border mt-1 rounded-lg border-gray-700 hover:bg-purple-800/30 bg-gray-900" placeholder="  Type your note.."
            value={note} onChange={handleinput} /><br/><br/>

          <button onClick={handleadd} className=" hover:shadow-lg text-white shadow-blue-700/20 hover:border-2 border-gray-400 rounded bg-blue-700">
            &nbsp;&nbsp;{addbutton}&nbsp;&nbsp;</button>
        </div>
        <ol className='p-3 '>
          {items.map((item, index) => ({ item, index }))
            .filter(({ item }) => showArchive ? item.archive : !item.archive)
            .map(({ item, index }) => (
              <li key={item.id} 
              className="border-gray-900 border hover:shadow-xl hover: shadow-[0_0_20px_rgba(124,58,237,0.25)]
               hover:border-blue-500 rounded-3xl text-gray-300  bg-gray-000 mt-4 hover:-translate-y-1 duration-500 hover:-translate-x-1 duration-500"
               >

                <p className="font-bold text-lg pl-4 pt-3">{item.title}</p>

                <p className='pl-4 '>{item.note}</p>
                 <hr className="text-gray-800 mt-5 ml-4 mr-4"></hr> 

                <div className="flex justify-end  pt-3 pb-2 pr-3" >
                  

                <button className="text-xl text-purple-500 hover:border-1 rounded-lg border-purple-900"
                  onClick={() => {
                    handleedit(index,item.id)
                  }}>&nbsp;✎&nbsp;</button>

                <button className="text-3xl pl-2 hover:border-1 rounded-lg border-gray-600 "
                  onClick={() => handleshowpin(index)}>🖈&nbsp;</button>

                <button className=" text-xl pl-2 hover:border-1 rounded-lg border-red-900" onClick = {() => {

                  handledelete(item.id)

                }}>⛔&nbsp;</button>

                <button className="text-xl pl-2 hover:border-1 rounded-lg border-blue-800"
                  onClick={() => handlearchive(index,item.id)}>
                  ⤵&nbsp;  </button>

                <button className="text-xl pl-2 hover:border-1 rounded-lg border-blue-800 "
                  onClick={() => handleunarchive(index,item.id)}>
                  ⤴ &nbsp; </button>

                  </div>

              </li>
            ))}
        </ol>
        </div>
      </>
    )
  }

  export default Inputandbutton