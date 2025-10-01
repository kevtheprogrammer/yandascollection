'use client'

import { Avatar } from '@/components/avatar'
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/dropdown'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '@/components/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from '@/components/sidebar'
import { SidebarLayout } from '@/components/sidebar-layout'
import {
  ArrowRightStartOnRectangleIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  UserIcon,
} from '@heroicons/react/16/solid'
import {
    ClipboardDocumentIcon,
  CreditCardIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  TicketIcon,
} from '@heroicons/react/20/solid'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'


export default function ApplicationLayout({ children }: { children: React.ReactNode }) {
  let pathname = usePathname()
  const { data: session } = useSession()
  const user = session?.user
  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <NavbarItem href="/search" aria-label="Search">
              <MagnifyingGlassIcon />
            </NavbarItem>
            <NavbarItem href="/inbox" aria-label="Inbox">
              <InboxIcon />
            </NavbarItem>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <Avatar src="/profile-photo.jpg" square />
              </DropdownButton>
              <DropdownMenu className="min-w-64" anchor="bottom end">
                <DropdownItem href="/my-profile">
                  <UserIcon />
                  <DropdownLabel>My profile</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="/settings">
                  <Cog8ToothIcon />
                  <DropdownLabel>Settings</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="/privacy-policy">
                  <ShieldCheckIcon />
                  <DropdownLabel>Privacy policy</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="/share-feedback">
                  <LightBulbIcon />
                  <DropdownLabel>Share feedback</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="/logout">
                  <ArrowRightStartOnRectangleIcon />
                  <DropdownLabel>Sign out</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <Image src="/logo.png" alt='logo' width={200} height="100" className='mb-3' />
            <SidebarSection className="max-lg:hidden">
              <SidebarItem href="/search">
                <MagnifyingGlassIcon />
                <SidebarLabel>Search</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/business/staff" current={pathname === '/business/staff'}>
                <InboxIcon />
                <SidebarLabel>Staff Users</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/business/customers" current={pathname.startsWith('/business/customers')}>
                <UserIcon />
                <SidebarLabel>Customers</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/business/products" current={pathname.startsWith('/business/products')}>
                <ClipboardDocumentIcon   />
                <SidebarLabel>Products</SidebarLabel>
              </SidebarItem>
              {/* <SidebarItem href="/business/stock" current={pathname.startsWith('/business/stock')}>
                <InboxStackIcon />
                <SidebarLabel>Media & Stock</SidebarLabel>
              </SidebarItem> */}
              <SidebarItem href="/business/orders" current={pathname.startsWith('/business/orders')}>
                <TicketIcon />
                <SidebarLabel>Orders</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/business/payments" current={pathname.startsWith('/business/payments')}>
                <CreditCardIcon />
                <SidebarLabel>Payment</SidebarLabel>
              </SidebarItem>
             
            </SidebarSection>
            {/* <SidebarSection className="max-lg:hidden">
              <SidebarHeading>Quick Reports</SidebarHeading>
              <SidebarItem href="/events/1">Today's Sales</SidebarItem>
              <SidebarItem href="/events/2">Stock Level</SidebarItem>
              <SidebarItem href="/events/3">Weekly Sales</SidebarItem>
              <SidebarItem href="/events/4">Trending Products</SidebarItem>
            </SidebarSection>
            <SidebarSpacer /> */}
            
          </SidebarBody>
          <SidebarFooter className="max-lg:hidden">
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <span className="flex min-w-0 items-center gap-3">
                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">{user?.firstName} {user?.lastName}</span>
                    <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                      {user?.email}
                    </span>
                  </span>
                </span>
                <ChevronUpIcon />
              </DropdownButton>
              <DropdownMenu className="min-w-64" anchor="top start">
         
                <DropdownDivider />
                <DropdownItem href="/api/auth/signout">
                  <ArrowRightStartOnRectangleIcon />
                  <DropdownLabel>Sign out</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  )
}