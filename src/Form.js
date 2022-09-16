import { useState } from 'react'

const slides = [
    {
        heading: "Personal Details",
        data: [
            [{ title: "First Name", type: "text" }, { title: "Last Name", type: "text" }],
            [{ title: "Date of Birth", type: "date" }],
            [{ title: "Email", type: "email" }, { title: "Mobile No.", type: "text" }],
            [{ title: "Password", type: "password" }]
        ]
    },
    {
        heading: "Address",
        data: [
            [{ title: "House No.", type: "text" }, { title: "Sector / Street No.", type: "text" }],
            [{ title: "City", type: "text" }, { title: "State", type: "text" }],
            [{ title: "Country", type: "text" }],
            [{ title: "Pincode", type: "number" }]
        ]
    },
    {
        heading: "Billing",
        data: [
            [{ title: "Card No.", type: "number" }, { title: "Card Holdeer Name", type: "text" }],
            [{ title: "Expiry Date", type: "date" }],
            [{ title: "CVV", type: "number" }],
        ]
    }
]

const validate = (meta, index) => {
    const head = slides[index].heading

    if (meta[head] === undefined) return false

    slides[index].data.forEach(row => {
        row.forEach(sub => {
            if (!meta[head][sub.title]) return false
        })
    });

    return true
}

function Welcome({ setSlide }) {
    return (
        <div className='Welcome'>
            <h1>Welcome to eCommerce</h1>
            <h2>Start by Creating an account</h2>

            <div className='buy' onClick={() => setSlide(0)}>
                <p>Start</p>
            </div>
        </div>
    )
}

function Finalise({ meta, setSlide, setPage }) {
    return (
        <div className='Finalise'>
            <h2>Confirm Your Details</h2>

            {
                slides.map(slide => {
                    return (
                        <div className='slide'>
                            <h1>{slide.heading}</h1>
                            {
                                slide.data.map(obj => {
                                    return (
                                        <div className='slideRow'>
                                            {
                                                obj.map(v => {
                                                    return (
                                                        <div className='slideRowCol slideRowColDisplay'>
                                                            <p>{v.title}</p>
                                                            <h1>{meta[slide.heading][v.title]}</h1>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                })
            }

            <div className='finaliseBtn'>
                <div className='buy' onClick={() => setSlide(-1)}>
                    <p>Go Back</p>
                </div>
                <div className='buy' onClick={() => setPage("app")}>
                    <p>Confirm</p>
                </div>
            </div>
        </div>
    )
}

function Slider({ slide, setSlide, meta, setMeta }) {
    return (
        <div className='Slider'>
            <div className='slide'>
                <h1>{slides[slide].heading}</h1>
                {
                    slides[slide].data.map(obj => {
                        return (
                            <div className='slideRow'>
                                {
                                    obj.map(v => {
                                        return (
                                            <div className='slideRowCol'>
                                                <p>{v.title}</p>
                                                <input type={v.type} value={meta[slides[slide].heading] === undefined ? "" : meta[slides[slide].heading][v.title]} onChange={e => {
                                                    setMeta(({ ...pre }) => {
                                                        if (pre[slides[slide].heading] === undefined) pre[slides[slide].heading] = {}
                                                        pre[slides[slide].heading][v.title] = e.target.value
                                                        return pre
                                                    })
                                                }} />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
            <div className='sliderBtn'>
                <button onClick={() => {
                    if (validate(meta, slide))
                        setSlide(s => s - 1)
                    else
                        alert("Please fill all values")
                }}>&lt;&lt; Previous</button>
                <button onClick={() => {
                    if (validate(meta, slide))
                        setSlide(s => s + 1)
                    else
                        alert("Please fill all values")
                }}>Next &gt;&gt;</button>
            </div>
        </div>
    )
}

export default function Form({ setPage }) {
    const [slide, setSlide] = useState(-1)
    const [meta, setMeta] = useState({})

    if (slide === -1)
        return <Welcome setSlide={setSlide} />

    if (slide === 3)
        return <Finalise meta={meta} setSlide={setSlide} setPage={setPage} />

    return <Slider slide={slide} setSlide={setSlide} meta={meta} setMeta={setMeta} />
}
