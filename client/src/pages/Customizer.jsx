import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'
import state from '../store'
import { fadeAnimation, slideAnimation } from '../config/motion'
import { downloadCanvasToImage, reader } from '../config/helpers'
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components'
import { FilterTabs, EditorTabs, DecalTypes } from '../config/constants'
import { logoShirt, stylishShirt } from '../assets'


const Customizer = () => {
    const snap = useSnapshot(state)
    const [file, setFile] = useState('')
    const [prompt, setPrompt] = useState('')
    const [generatingImg, setGeneratingImg] = useState(false)
    const [activeEditorTab, setActiveEditorTab] = useState('')
    const [activeFilterTab, setActiveFilterTab] = useState({
        logoShirt: true,
        stylishShirt: false
    })

    const generateContent = () => {
        switch (activeEditorTab) {
            case 'colorpicker':
                return <ColorPicker />
            case 'filepicker':
                return <FilePicker file={file} setFile={setFile} readFile={readFile} />
            case 'aipicker':
                return <AIPicker
                    prompt={prompt}
                    setPrompt={setPrompt}
                    generatingImg={generatingImg}
                    handleSubmit={handleSubmit}
                />
            default:
                return null
        }
    }

    const handleSubmit = async (type) => {
        if (!prompt) return alert('please enter prompt')

        try{
            setGeneratingImg(true)
            const response = await fetch('http://localhost:8080/api/v1/dalle',{method:'Post',headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify({
                prompt
            })
        })

            const data = await response.json()

            handleDecals(type,`data:image/png;base64,${data.photo}`)
        }catch(err){
            alert(err)
        }
        finally{
            setGeneratingImg(false)
            setActiveEditorTab('')
        }
    }

    const handleDecals = (type, result) => {
        const decalType = DecalTypes[type]
        state[decalType.stateProperty] = result;
        if (!activeFilterTab[decalType.filterTab]) {
            handleActiveFilterTab(decalType.filterTab)
        }
    }

    const handleActiveFilterTab = (tabName) => {
        switch (tabName) {
            case 'logoShirt':
                state.isLogoTexture = !activeFilterTab[tabName]
                break;
            case 'stylishShirt':
                state.isFulltexture = !activeFilterTab[tabName]
                break;
            default:
                state.isLogoTexture = true
                state.isFulltexture = false
        }
        setActiveFilterTab((prev) => {
            return {
                ...prev,
                [tabName]: !prev[tabName]
            }
        })
    }


    const readFile = (type) => {
        reader(file).then((result) => {
            handleDecals(type, result);
            setActiveEditorTab('')
        })
    }

    return (
        <AnimatePresence>
            {!snap.intro && (<>
                <motion.div key={'custom'}
                    className='absolute top-0 left-0 z-10'
                    {...slideAnimation('left')}
                >
                    <div className="flex items-center min-h-screen">
                        <div className="editortabs-container tabs">
                            {
                                EditorTabs.map((tab => (
                                    <Tab
                                        key={tab.name}
                                        tab={tab}
                                        handleClick={() => { setActiveEditorTab(tab.name) }}
                                    />
                                )))
                            }
                            {generateContent()}
                        </div>
                    </div>
                </motion.div>
                <motion.div className='absolute top-5 z-10 right-5' {...fadeAnimation}>
                    <CustomButton
                        type={'filled'}
                        title={'Go Back'}
                        handleClick={() => state.intro = true}
                        customStyles={'w-fit pz-4 py-2.5 font-bold text-sm'}
                    />
                </motion.div>
                <motion.div className='filtertabs-container' {...slideAnimation('up')}>
                    {
                        FilterTabs.map((tab => (
                            <Tab
                                key={tab.name}
                                tab={tab}
                                isFilterTab
                                isActiveTab={activeFilterTab[tab.name]}
                                handleClick={() => handleActiveFilterTab(tab.name)}
                            />
                        )))
                    }
                </motion.div>
            </>
            )}
        </AnimatePresence>
    )
}

export default Customizer