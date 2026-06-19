import { useState } from 'react'

function Inputandbutton() {
  const [addbutton, setAddbutton] = useState("Add")

  const [title, setTitle] = useState("")

  const [note, setNote] = useState("")

  const [items, setItems] = useState(JSON.parse(localStorage.getItem("local")) || [])

  const [isediting, setIsediting] = useState(false)

  const [editindex, setEditindex] = useState(null)

  const [showArchive, setShowArchive] = useState(false)

  const [showpin, setShowpin] = useState(false)

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
      const update = items.map((item, index) =>
        index === editindex ? { ...item, title, note } : item
      )
      setItems(update)
      setEditindex(null)
      setIsediting(false)

    }
    else if (note.trim() !== "" && title.trim() !== "") {
      const local = [...items, { title, note, archive: false, showpin: false }]

      localStorage.setItem("local",JSON.stringify(local))

      const localview = JSON.parse(localStorage.getItem("local"))

      setItems(localview)

    } else if (title === "") {
      alert("add title")

    } else if (note === "") {
      alert("add note")
    }
    setNote("")
    setTitle("")

  }
  const handledelete = (indexofdelete) => {
    setItems(items.filter((value, index) => {
      return (
        indexofdelete !== index
      )
    }))
  }
  const handleedit = (indextoedit) => {
    setTitle(items[indextoedit].title)
    setNote(items[indextoedit].note)
    setAddbutton("Save")
    setEditindex(indextoedit)
    setIsediting(true)

  }
  const handlearchive = (indexofarchive) => {
    const updated = items.map((item, position) =>
      position === indexofarchive ? { ...item, archive: true } : item
    )
    setItems(updated)
  }

  const handleunarchive = (indexofarchive) => {
    const updated = items.map((item, position) =>
      position === indexofarchive ? { ...item, archive: false } : item
    )
    setItems(updated)
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
    <div className=" border rounded-lg p-4 bg-gray-800 m-6">
       <h1 className='mb-4 font-bold text-3xl text-white '>📝 My Notes</h1>
      <div>
        <button className="border-2 rounded-lg bg-black text-white"
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
        <input type="text" className="w-full border border-gray-700 rounded-lg bg-gray-700" placeholder="  Title"
          value={title} onChange={handletitle} />
        <br />
        <textarea
          type="text" className="w-full border mt-1 rounded-lg border-gray-700 bg-gray-700" placeholder="  Type your note.."
          value={note} onChange={handleinput} />

        <button onClick={handleadd} className=" rounded bg-blue-700">
          &nbsp;&nbsp;{addbutton}&nbsp;&nbsp;</button>
      </div>
      <ol>
        {items.map((item, index) => ({ item, index }))
          .filter(({ item }) => showArchive ? item.archive : !item.archive)
          .map(({ item, index }) => (
            <li key={index} className="border-2 rounded-lg text-gray-300 border-gray-900 bg-gray-900 mt-4">

              <p className="font-bold text-lg">{item.title}</p>

              <p>{item.note}</p>

              <div className="flex justify-end" >

              <button className="text-xl"
                onClick={() => {
                  handleedit(index)
                }}>&nbsp;✎&nbsp;</button>

              <button className="text-2xl"
                onClick={() => handleshowpin(index)}>🖈</button>

              <button className=" text-xl" onClick={() => {

                handledelete(index)

              }}>⛔</button>

              <button className="text-xl "
                onClick={() => handlearchive(index)}>
                ⤵  </button>

              <button className="text-xl"
                onClick={() => handleunarchive(index)}>
                ⤴  </button>

                </div>

            </li>
          ))}
      </ol>
      </div>
    </>
  )
}

export default Inputandbutton