import { Route, Routes } from 'react-router-dom'
import QrCheckout from '../../pages/qrmenu/QrCheckout'
import QrItemDetail from '../../pages/qrmenu/QrItemDetail'
import QrNotAuthorized from '../../pages/qrmenu/QrNotAuthorized'
import QrNotFound from '../../pages/qrmenu/QrNotFound'
import QrBills from '../../pages/QrMenu/QrBills'
import KitchenStarter from '../../pages/kitchen/KitchenStarter'
import KitchenIndex from '../../pages/kitchen/KitchenIndex'
import KitchenNotAuthorized from '../../pages/kitchen/KitchenNotAuthorized'
import QrStarter from '../../pages/qrmenu/QrStarter'
import QrIndex from '../../pages/QrMenu/QrIndex'

const Navigators = () => {
  return (
    <Routes>
        <Route path="/qr" element={<QrStarter/>}>
          <Route path="checkout" element={<QrCheckout/>} />
          <Route path="bills" element={<QrBills/>} />
          <Route path="details" element={<QrItemDetail/>} />
          <Route path="authorization-error" element={<QrNotAuthorized/>} />
          <Route path="" element={<QrIndex />} />
          <Route path="*" Component={QrNotFound} />
        </Route>

        <Route path='/kitchen' element={<KitchenStarter/>}>
          <Route path="" element={<KitchenIndex />} />
          <Route path="authorization-error" element={<KitchenNotAuthorized/>} />
        </Route>
        
    </Routes>
  )
}

export default Navigators