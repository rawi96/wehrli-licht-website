import GoogleMapReact from 'google-map-react'
import Link from 'next/link'
import { global } from '../../data/global'

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY

const Marker = ({}: { lat: number; lng: number }) => (
  <Link href={global.address.maps}>
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wehrli p-10 text-sm font-bold leading-5 text-white hover:underline">
      Wehrli Licht
    </div>
  </Link>
)

const defaultProps = {
  center: {
    lat: 47.477904,
    lng: 9.472935,
  },
  zoom: 15,
}

export const GoogleMap = () => {
  console.log(API_KEY)
  return (
    <div className="full-width mb-20 h-[50vh]">
      <GoogleMapReact
        bootstrapURLKeys={{ key: API_KEY || '' }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <Marker lat={defaultProps.center.lat} lng={defaultProps.center.lng} />
      </GoogleMapReact>
    </div>
  )
}
