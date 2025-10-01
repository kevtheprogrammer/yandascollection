'use client'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Popover, PopoverButton, PopoverGroup, PopoverPanel } from '@headlessui/react'
import { MagnifyingGlassIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useAppContext } from '@/context/AppProvider'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useEffect, useState } from 'react'
import { deleteCart, fetchCart, updateCart } from '@/store/actions/cartActions'
import { RootState } from '@/store'
import { FieldArray, Formik } from 'formik'
import * as Yup from 'yup'
import { useSession } from 'next-auth/react'

const navigation = {
  other: [
    { name: 'Products', href: '/products' },
    // { name: 'Contact Us', href: '#' }, 
  ],
};

 
export default function NavBarComp() {
    const { data: session } = useSession();

  const { cartDrawerOpen, toggleCartDrawer, } = useAppContext();
  const dispatch = useAppDispatch();
  const cart  = useAppSelector((state: RootState) => state.cart.cart);
  const total  = useAppSelector((state: RootState) => state.cart.total);

  useEffect(() => {
    dispatch(fetchCart());    
  }, [dispatch]);


 
const userNavigation = session
  ? [
      { name: 'My Orders', href: '/checkout/order-history' },
      { name: 'Sign Out', href: '/api/auth/signout' },
    ]
  : [
      { name: 'Sign In', href: '/signin' },
      { name: 'Register', href: '/signup' },
    ];
 

  const validationSchema = Yup.object({
    cartItems: Yup.array().of(
      Yup.object().shape({
        id: Yup.number().required("Please select product quantity"),
        quantity: Yup.number().required("Please select product quantity"),
        size: Yup.string(),
        product: Yup.object().shape({
          id: Yup.number(),
          price: Yup.number(),
          imageUrl: Yup.string(),
        }),
      })
    ),
  });

  return (
    <>
      <div className="bg-white">
        <header className="relative bg-white">
          <nav aria-label="Top" className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="border-b border-gray-200 px-4 pb-14 sm:px-0 sm:pb-0">
              <div className="flex items-center justify-between py-4">
                <div className="flex flex-1">
                  <a href="/">
                    <span className="sr-only">Yanda's Collection</span>
                    <img alt="Logo" src="/logo.png" className="h-auto lg:w-35 " />
                  </a>
                </div>

                {/* Flyout menus */}
                <PopoverGroup className="absolute inset-x-0 bottom-0 sm:static sm:flex-1 sm:self-stretch">
                  <div className="flex h-14 space-x-8 overflow-x-auto border-t px-4 pb-px sm:h-full sm:justify-center sm:overflow-visible sm:border-t-0 sm:pb-0">
                     
                  {[...navigation.other, ...userNavigation].map((item) => (
                    <a key={item.name} href={item.href} className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800">
                      {item.name}
                    </a>
                  ))}

                  </div>
                </PopoverGroup>

                {/* Cart */}
                <div className="ml-4 flow-root lg:ml-8">
                  <button onClick={toggleCartDrawer} className="group -m-2 flex items-center p-2">
                    <ShoppingBagIcon aria-hidden="true" className="size-6 shrink-0 text-gray-400 group-hover:text-gray-500" />
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">{cart?.items?.length}</span>
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </header>
      </div>

      {/* Cart Drawer */}
      <Dialog open={cartDrawerOpen} onClose={toggleCartDrawer} className="relative z-10 ">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden ">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 ">
              <DialogPanel
                transition
                className=" m-3  pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700 "
              >
                <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl rounded-xl">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className="text-base font-semibold text-gray-900">My Cart</DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => toggleCartDrawer()}
                          className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:outline-hidden"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6">
                    <Formik
                      enableReinitialize
                      validationSchema={validationSchema}
                      initialValues={{
                        cartItems: cart?.items?.map((item:any) => ({
                          id: item.id,
                          quantity: item.quantity,
                          size: item.size,
                          product: item.product,
                        })) || [],
                      }}
                      onSubmit={(values) => console.log('submit', values)}

                    >
                      {({ values, handleChange, setFieldValue }) => (
                         !session ? (
                          <div className='flex flex-col h-full items-center justify-center gap-4 p-4'>
                            <img src={'/logo.png'} width={200} />
                            <h4 className='text-2xl font-bold'>Please Login to view your cart</h4>
                            <p className='text-gray-500'>You can not checkout without logging in</p>
                            <a href="/signin">
                              <button className='mt-4 rounded-md bg-pink-600 px-4 py-2 text-white hover:bg-pink-700 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:outline-hidden'>Login</button>
                            </a>
                          </div>
                        ): <>
                          <FieldArray name="cartItems">
                            {() => (
                              <div className="mt-6 px-4 sm:px-6">
                                {values.cartItems.length === 0 ? (
                                  <p className="text-center text-gray-500">Your cart is empty.</p>
                                ) : (

                                  values.cartItems.map((item:any, index:number) => (
                                    <div key={item.id} className="flex flex-col gap-2 mb-8">
                                      <div className="flex justify-between">
                                        <div className="flex gap-5">
                                          <img alt="product" className="w-10 object-cover" src={item.product.imageUrl} />
                                          <div>
                                            <h2 className='font-bold capitalize'>{item.product.name}</h2>
                                            <div className='font-normal'>size: {item.size} </div>

                                          </div>
                                        </div>
                                        <div>K{item.product.price}</div>
                                      </div>
                                      <div className='flex justify-between items-center'>
                                        <div className="flex gap-6 items-center">
                                          <button type="button"
                                            onClick={() => {
                                              const newQuantity = item.quantity - 1;
                                              if (newQuantity >= 1) {
                                                setFieldValue(`cartItems.${index}.quantity`, newQuantity)
                                                dispatch(updateCart(item?.id, newQuantity))
                                              }
                                            }}
                                            // onClick={(values) =>  setFieldValue(`cartItems.${index}.quantity`, item.quantity - 1)}
                                            className='cursor-pointer rounded-sm bg-white px-3 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 '> - </button>
                                            <div>{item.quantity}</div>
                                          <button type="button"
                                            onClick={() => {
                                              const newQuantity = item.quantity + 1;
                                              if (newQuantity >= 1) {
                                                setFieldValue(`cartItems.${index}.quantity`, newQuantity)
                                                dispatch(updateCart(item?.id, newQuantity))
                                              }
                                            }}

                                            className='cursor-pointer rounded-sm bg-white px-3 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 '> + </button>
                                        </div>
                                        <button  type='button' 
                                          onClick={()=>
                                            {
                                              dispatch(deleteCart(item?.id));
                                              // setAppAlert({
                                              //   live:true,
                                              //   status:'success',
                                              //   title:'Remove an Item from cart',
                                              //   msg:'removed with success 1 item from cart, This item can not be retrieved from the server.'
                                              // })
                                          }
                                        }
                                         className='cursor-pointer ' >
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                          </svg>
                                        </button>
                                        <div>K{item.quantity * item.product.price}</div>
                                      </div>


                                    </div>
                                  ))
                                )}
                              </div>
                            )}
                          </FieldArray>
                          <div className='p-4'>
                            <div className='flex flex-row justify-between'>
                              <div className='font-medium'>total</div>
                              <div className='font-bold text-blue-600'>K{total}</div>
                            </div>

                            <a href="/checkout">
                              <button
                                type="submit"
                                className="w-full mt-4 rounded-md border border-transparent bg-pink-600 px-4 py-3 text-base font-medium text-white shadow-xs hover:bg-pink-700 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden"
                              >
                                Checkout
                              </button>
                            </a>
                          </div>
                        </>

                      )}
                    </Formik>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}



