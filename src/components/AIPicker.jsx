import React from 'react'
import CustomButton from './CustomButton'


const AIPicker = ({prompt,setPrompt,generatingImg,handleSubmit}) => {
  return (
    <div className='aipicker-container'>
      <p className='flex mx-auto'>Coming Soon</p>
      {/* <textarea
      rows={5}
      placeholder='Ask ai..'
      value={prompt}
      onChange={(e)=>setPrompt(e.target.value)}
      className='aipicker-textarea'
      />
      <div className="flex flex-wrap gap-3">
        {
          generatingImg ? 
          <CustomButton
          type={'outline'}
          title={'asking ai'}
          customStyles={'text-xs'}
          />:<>
          <CustomButton
          type={'outline'}
          title={'AI Logo'}
          handleClick={()=>handleSubmit('logo')}
          customStyles={
            'text-xs'
          }
          />
          <CustomButton
          type={'filed'}
          title={'AI Full'}
          handleClick={()=>handleSubmit('full')}
          customStyles={
            'text-xs'
          }
          />
          </>
        }
      </div> */}
    </div>
  )
}

export default AIPicker