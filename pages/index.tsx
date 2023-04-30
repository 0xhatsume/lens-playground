'use client'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { client, exploreProfiles } from '../api'
import Link from 'next/link'

const Home: NextPage = () => {
  const [profiles, setProfiles] = useState<any>([])
  useEffect(() => {
    fetchProfiles()
  }, [profiles])
  async function fetchProfiles() {
    try {
      /* fetch profiles from Lens API */
      let response = await client.query({ query: exploreProfiles })
      /* loop over profiles, create properly formatted ipfs image links */
      let profileData = await Promise.all(
        response.data.exploreProfiles.items.map(
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
      /* update the local state with the profiles array */
      setProfiles(profileData)
    } catch (err) {
      console.log({ err })
    }
  }
  return (
    <div className='pt-20'>
      <div className='flex flex-col justify-center items-center'>
        <h1 className='text-5xl mb-6 font-bold'>Hello Lens 🌿</h1>
        <div className='container mx-auto border-solid border-2'>

        {/* pagination bar */}
        <div className='flex justify-center mt-1 mb-3'>
          <nav aria-label="Page navigation example">
            <ul className="inline-flex -space-x-px">
              <li>
                <a href="#" className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
              </li>
              <li>
                <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
              </li>
              <li>
                <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
              </li>
              <li>
                <a href="#" aria-current="page" className="px-3 py-2 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
              </li>
              <li>
                <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">4</a>
              </li>
              <li>
                <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">5</a>
              </li>
              <li>
                <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
              </li>
            </ul>
          </nav>
          </div>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-2 px-2'>
        {
            profiles.map(profile => (


              <div key={profile.id} className='
                block justify-center max-w-sm p-6 
                bg-white border border-gray-200 rounded-lg shadow-blue shadow-xl hover:drop-shadow-lg
                items-center'>
                
                <img className='w-36 mx-auto rounded-lg' src={profile.avatarUrl || 'https://picsum.photos/200'} />
                
                <div className='w-60 mx-auto'>
                  <p className='text-lg text-center mt-6'>{profile.name}</p>
                  
                  <p className='text-sm text-gray-400  text-center mt-2'>{profile.bio}</p>

                  <Link href={`/profile/${profile.handle}`}>
                    <p className='cursor-pointer text-blue-600 hover:text-purple-600
                      text-base font-medium text-center mt-2 mb-2'>{profile.handle}</p>
                  </Link>
                  <p className='text-pink-600 text-sm font-medium text-center'>{profile.stats.totalFollowers} followers</p>
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
