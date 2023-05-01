import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { client, exploreProfiles } from '../../api'
import Link from 'next/link'
import {useQuery} from '@apollo/client'

const Home: NextPage = () => {
  const [profiles, setProfiles] = useState<any>([])
  const [page, setPage] = useState(1)
  const [pagelimit, setPageLimit] = useState(12)
  const [prevBool, setPrevBool] = useState(false)
  const [nextBool, setNextBool] = useState(false)
  
  let {data, loading, error} = useQuery(exploreProfiles,
    {
      client,
      variables:{
        "limit": pagelimit,
        "cursor": `{\"offset\":${(page-1)*pagelimit}}`
      },
      onCompleted: async (d)=>{
        console.log("data done.")
        setProfiles(
          await Promise.all(
            d.exploreProfiles.items.map(
              async profileInfo => {
                let profile = { ...profileInfo }
                let picture = profile.picture
                if (picture && picture.original && picture.original.url) {
                  if (picture.original.url.startsWith('ipfs://')) {
                    let result = picture.original.url.substring(7, picture.original.url.length)
                    profile.avatarUrl = `http://lens.infura-ipfs.io/ipfs/${result}`
                  } else {
                    profile.avatarUrl = picture.original.url
                  }
                }
                return profile
                }
            )
          )
        )
        setPrevBool(page==1)
        setNextBool(d.exploreProfiles.pageInfo.next==null)
      },
      onError: (errorData)=>{
        console.log(errorData);
      }
    }
  )
  useEffect(() => {
    //fetchProfiles()
    //console.log(data.exploreProfiles.pageInfo)
  }, [])

  function incrementPage(){
    setPage(page+1)
  }
  function decrementPage(){
    if(page-1>0){
      setPage(page-1)
    }
  }
  return (
    <div className='pt-20'>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='mb-6 text-5xl font-bold'>Hello Lens 🌿</h1>
        <div className='container w-1/2 mx-auto'>

        {/* pagination bar */}
        <div className='flex justify-center mb-3'>
              <button disabled={prevBool} type="button" onClick={decrementPage} 
                className={`w-36 px-3 py-2 mx-0 ${prevBool ? 'bg-gray-400 text-gray-300' : 
                  'bg-lime-400 focus:ring-2 focus:ring-green-800 hover:bg-gray-800 hover:text-white'} 
                  border border-sky-700 rounded-l-lg`}>
                Previous
              </button>
              <button disabled={nextBool} type="button" onClick={incrementPage} 
                className={`w-36 px-3 py-2 mx-0 ${nextBool ? 'bg-gray-400 text-gray-300': 
                'bg-lime-400 focus:ring-2 focus:ring-green-800 hover:bg-gray-800 hover:text-white'} 
                border border-sky-700 rounded-r-lg`}>
                Next
              </button>
          </div>
        <div className='grid grid-cols-2 gap-2 px-2 md:grid-cols-4'>
        {
            profiles.map(profile => (


              <div key={profile.id} className='items-center justify-center block max-w-sm p-6 bg-white border rounded-lg shadow-xl border-sky-900 shadow-blue hover:drop-shadow-lg'>
                
                <img className='w-24 mx-auto rounded-lg' src={profile.avatarUrl || 'https://picsum.photos/200'} />
                
                <div className='w-48 mx-auto'>
                  <p className='mt-6 text-lg text-center'>{profile.name}</p>
                  
                  <p className='mt-2 text-sm text-center text-gray-400'>{profile.bio}</p>

                  <Link href={`/profile/${profile.handle}`}>
                    <p className='mt-2 mb-2 text-base font-medium text-center text-blue-600 cursor-pointer hover:text-purple-600'>{profile.handle}</p>
                  </Link>
                  <p className='text-sm font-medium text-center text-pink-600'>{profile.stats.totalFollowers} followers</p>
                </div>
              </div>


            ))
          }
          </div>

        </div>
        
      </div>
    </div>
  )
}

export default Home
