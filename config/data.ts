const roles = [
  {
    name: 'Super Admin',
    description:
      'Super Admins can access and manage all features and settings.',
    type: 'SUPER_ADMIN',
  },
  {
    name: 'Author',
    description: 'Authors can manage the content they have created.',
    type: 'AUTHOR',
  },
  {
    name: 'Editor',
    description:
      'Editors can manage and publish contents including those of other users.',
    type: 'EDITOR',
  },
  {
    name: 'Public',
    description: 'Default role given to unauthenticated user.',
    type: 'PUBLIC',
  },
  {
    name: 'Authenticated',
    description: 'Default role given to authenticated user.',
    type: 'AUTHENTICATED',
  },
  {
    name: 'Driver',
    description: 'Default role given to driver user.',
    type: 'DRIVER',
  },
  {
    name: 'Rider',
    description: 'Default role given to rider user.',
    type: 'RIDER',
  },
]

const users = {
  name: 'Ahmed Ibrahim',
  email: 'info@ahmedibra.com',
  password: '123456',
  confirmed: true,
  blocked: false,
  platform: 'web',
}

const profile = {
  mobile: '252615301507',
  address: 'Mogadishu',
  image: 'https://github.com/ahmaat19.png',
  bio: 'Full Stack Developer',
}

const sort = {
  hidden: 0,
  profile: 1,
  admin: 2,
  report: 3,
  normal: 4,
}

const clientPermissions = [
  {
    name: 'Home',
    path: '/',
    menu: 'hidden',
    sort: sort.hidden,
    description: 'Home page',
  },
  {
    name: 'Users',
    path: '/admin/users',
    menu: 'admin',
    sort: sort.admin,
    description: 'Users page',
  },
  {
    name: 'Roles',
    path: '/admin/roles',
    menu: 'admin',
    sort: sort.admin,
    description: 'Roles page',
  },
  {
    name: 'Profile',
    path: '/account/profile',
    menu: 'profile',
    sort: sort.profile,
    description: 'Profile page',
  },
  {
    name: 'Permissions',
    path: '/admin/permissions',
    menu: 'admin',
    sort: sort.admin,
    description: 'Permissions page',
  },
  {
    name: 'Client Permissions',
    path: '/admin/client-permissions',
    menu: 'admin',
    sort: sort.admin,
    description: 'Client Permissions page',
  },
  {
    name: 'User Roles',
    path: '/admin/user-roles',
    menu: 'admin',
    sort: sort.admin,
    description: 'User Roles page',
  },
  {
    name: 'User Profiles',
    path: '/admin/user-profiles',
    menu: 'admin',
    sort: sort.admin,
    description: 'User Profiles page',
  },
  {
    name: 'Trips',
    path: '/trips',
    menu: 'normal',
    sort: sort.normal,
    description: 'Trips page',
  },
  // {
  //   name: 'Chats',
  //   path: '/chats',
  //   menu: 'normal',
  //   sort: sort.normal,
  //   description: 'Chats page',
  // },
  {
    name: 'Payments',
    path: '/reports/payments',
    menu: 'reports',
    sort: sort.report,
    description: 'Payments page',
  },
  {
    name: 'Trips',
    path: '/reports/trips',
    menu: 'reports',
    sort: sort.report,
    description: 'Trips page',
  },
  {
    name: 'Drivers',
    path: '/reports/drivers',
    menu: 'reports',
    sort: sort.report,
    description: 'Drivers page',
  },
  {
    name: 'Riders',
    path: '/reports/riders',
    menu: 'reports',
    sort: sort.report,
    description: 'Riders page',
  },
  {
    name: 'Notifications',
    path: '/notifications',
    menu: 'normal',
    sort: sort.normal,
    description: 'Notifications page',
  },
]

const permissions = [
  // Users
  {
    description: 'Get All Users',
    route: '/api/auth/users',
    auth: true,
    name: 'Users',
    method: 'GET',
  },
  {
    description: 'Get User By Id',
    route: '/api/auth/users/:id',
    auth: true,
    name: 'Users',
    method: 'GET',
  },
  {
    description: 'Create User',
    route: '/api/auth/users',
    auth: true,
    name: 'Users',
    method: 'POST',
  },
  {
    description: 'Update User',
    route: '/api/auth/users/:id',
    auth: true,
    name: 'Users',
    method: 'PUT',
  },
  {
    description: 'Delete User',
    route: '/api/auth/users/:id',
    auth: true,
    name: 'Users',
    method: 'DELETE',
  },
  {
    description: 'Create Mobile User',
    route: '/api/auth/users/register',
    auth: true,
    name: 'Users',
    method: 'POST',
  },

  //   User Profile
  {
    description: 'Get All User Profiles',
    route: '/api/auth/user-profiles',
    auth: true,
    name: 'User Profiles',
    method: 'GET',
  },
  {
    description: 'Get Profile',
    route: '/api/auth/profile',
    auth: true,
    name: 'User Profile',
    method: 'GET',
  },
  {
    description: 'Update Profile',
    route: '/api/auth/profile',
    auth: true,
    name: 'User Profile',
    method: 'POST',
  },

  //   Role
  {
    description: 'Get All Roles',
    route: '/api/auth/roles',
    auth: true,
    name: 'Roles',
    method: 'GET',
  },
  {
    description: 'Create Role',
    route: '/api/auth/roles',
    auth: true,
    name: 'Roles',
    method: 'POST',
  },
  {
    description: 'Update Role',
    route: '/api/auth/roles/:id',
    auth: true,
    name: 'Roles',
    method: 'PUT',
  },
  {
    description: 'Delete Role',
    route: '/api/auth/roles/:id',
    auth: true,
    name: 'Roles',
    method: 'DELETE',
  },

  //   Permission
  {
    description: 'Get All Permissions',
    route: '/api/auth/permissions',
    auth: true,
    name: 'Permissions',
    method: 'GET',
  },
  {
    description: 'Create Permission',
    route: '/api/auth/permissions',
    auth: true,
    name: 'Permissions',
    method: 'POST',
  },
  {
    description: 'Update Permission',
    route: '/api/auth/permissions/:id',
    auth: true,
    name: 'Permissions',
    method: 'PUT',
  },
  {
    description: 'Delete Permission',
    route: '/api/auth/permissions/:id',
    auth: true,
    name: 'Permissions',
    method: 'DELETE',
  },

  //   User Role
  {
    description: 'Get All User Roles',
    route: '/api/auth/user-roles',
    auth: true,
    name: 'User Roles',
    method: 'GET',
  },
  {
    description: 'Create User Role',
    route: '/api/auth/user-roles',
    auth: true,
    name: 'User Roles',
    method: 'POST',
  },
  {
    description: 'Update User Role',
    route: '/api/auth/user-roles/:id',
    auth: true,
    name: 'User Roles',
    method: 'PUT',
  },
  {
    description: 'Delete User Role',
    route: '/api/auth/user-roles/:id',
    auth: true,
    name: 'User Roles',
    method: 'DELETE',
  },

  //   Client Permission
  {
    description: 'Get All ClientPermissions',
    route: '/api/auth/client-permissions',
    auth: true,
    name: 'ClientPermissions',
    method: 'GET',
  },
  {
    description: 'Create Permission',
    route: '/api/auth/client-permissions',
    auth: true,
    name: 'ClientPermissions',
    method: 'POST',
  },
  {
    description: 'Update Permission',
    route: '/api/auth/client-permissions/:id',
    auth: true,
    name: 'ClientPermissions',
    method: 'PUT',
  },
  {
    description: 'Delete Permission',
    route: '/api/auth/client-permissions/:id',
    auth: true,
    name: 'ClientPermissions',
    method: 'DELETE',
  },

  //   Trip
  {
    description: 'Get All Trips',
    route: '/api/trips',
    auth: true,
    name: 'Trips',
    method: 'GET',
  },
  {
    description: 'Create Trip',
    route: '/api/trips',
    auth: true,
    name: 'Trips',
    method: 'POST',
  },
  {
    description: 'Update Trip',
    route: '/api/trips/:id',
    auth: true,
    name: 'Trips',
    method: 'PUT',
  },
  {
    description: 'Delete Trip',
    route: '/api/trips/:id',
    auth: true,
    name: 'Trips',
    method: 'DELETE',
  },
  {
    description: 'Get Pending Trips',
    route: '/api/trips/pending',
    auth: true,
    name: 'Trips',
    method: 'GET',
  },
  {
    description: 'Get Near Trips',
    route: '/api/trips/near',
    auth: true,
    name: 'Trips',
    method: 'POST',
  },
  {
    description: 'Update Trip with Current Location',
    route: '/api/trips/location/:id',
    auth: true,
    name: 'Trips',
    method: 'PUT',
  },

  // Chat
  {
    description: 'Get All Chats',
    route: '/api/chats',
    auth: true,
    name: 'Chats',
    method: 'GET',
  },
  {
    description: 'Get Chat By Id',
    route: '/api/chats/:id',
    auth: true,
    name: 'Chats',
    method: 'GET',
  },
  {
    description: 'Create Chat',
    route: '/api/chats',
    auth: true,
    name: 'Chats',
    method: 'POST',
  },
  {
    description: 'Update Chat',
    route: '/api/chats/:id',
    auth: true,
    name: 'Chats',
    method: 'PUT',
  },
  {
    description: 'Delete Chat',
    route: '/api/chats/:id',
    auth: true,
    name: 'Chats',
    method: 'DELETE',
  },
  {
    description: 'Get Chat History By Id',
    route: '/api/chats/histories',
    auth: true,
    name: 'Chats',
    method: 'GET',
  },

  // Plate
  {
    description: 'Check Existing Plate',
    route: '/api/plates',
    auth: true,
    name: 'Plates',
    method: 'POST',
  },

  // Payment Transactions
  {
    description: 'Payment transactions',
    route: '/api/payments',
    auth: true,
    name: 'Payment transactions',
    method: 'GET',
  },

  // Driver Transactions
  {
    description: 'Driver transactions',
    route: '/api/drivers',
    auth: true,
    name: 'Driver transactions',
    method: 'GET',
  },

  // Account Deletion
  {
    description: 'Request Account deletion',
    route: '/api/accounts/request-deletion',
    auth: true,
    name: 'Account deletion',
    method: 'POST',
  },
  {
    description: 'Cancel Account deletion',
    route: '/api/accounts/cancel-request-deletion',
    auth: true,
    name: 'Account deletion',
    method: 'POST',
  },

  // Report
  {
    description: 'Get Payment Transactions',
    route: '/api/reports/payments',
    auth: true,
    name: 'Report',
    method: 'POST',
  },
  {
    description: 'Get Trips',
    route: '/api/reports/trips',
    auth: true,
    name: 'Report',
    method: 'POST',
  },
  {
    description: 'Get Drivers',
    route: '/api/reports/drivers',
    auth: true,
    name: 'Report',
    method: 'POST',
  },
  {
    description: 'Get Riders',
    route: '/api/reports/riders',
    auth: true,
    name: 'Report',
    method: 'POST',
  },

  // notification
  {
    description: 'Get Notifications',
    route: '/api/notifications',
    auth: false,
    name: 'Notifications',
    method: 'GET',
  },
  {
    description: 'Create Notification',
    route: '/api/notifications',
    auth: true,
    name: 'Notifications',
    method: 'POST',
  },
  {
    description: 'Update Notification',
    route: '/api/notifications/:id',
    auth: true,
    name: 'Notifications',
    method: 'PUT',
  },
  {
    description: 'Delete Notification',
    route: '/api/notifications/:id',
    auth: true,
    name: 'Notifications',
    method: 'DELETE',
  },
  {
    description: 'Send Notification',
    route: '/api/notifications/send',
    auth: true,
    name: 'Notifications',
    method: 'POST',
  },

  {
    description: 'Push Token',
    route: '/api/notifications/push-token',
    auth: true,
    name: 'Push Token',
    method: 'PUT',
  },

  // mobile
  {
    description: 'Push Token',
    route: '/api/mobile/notifications',
    auth: true,
    name: 'Notifications',
    method: 'POST',
  },
  {
    description: 'Get Notifications',
    route: '/api/mobile/notifications',
    auth: true,
    name: 'Notifications',
    method: 'GET',
  },
  {
    description: 'Get Payments',
    route: '/api/mobile/payments',
    auth: true,
    name: 'Payments',
    method: 'GET',
  },
  {
    description: 'Create Trip',
    route: '/api/mobile/trips',
    auth: true,
    name: 'Trip',
    method: 'POST',
  },
  {
    description: 'Update Trip',
    route: '/api/mobile/trips/:id',
    auth: true,
    name: 'Trip',
    method: 'PUT',
  },
  {
    description: 'Get Near Riders',
    route: '/api/mobile/trips/near',
    auth: true,
    name: 'Trip',
    method: 'POST',
  },
  {
    description: 'Check Pending Trip',
    route: '/api/mobile/trips/pending',
    auth: true,
    name: 'Trip',
    method: 'GET',
  },
  {
    description: 'Update Current Location',
    route: '/api/mobile/trips/location/:id',
    auth: true,
    name: 'Trip',
    method: 'PUT',
  },
  {
    description: 'Start Trip with Rider Two',
    route: '/api/mobile/trips/start-trip',
    auth: true,
    name: 'Trip',
    method: 'POST',
  },
  {
    description: 'Get Current Profile',
    route: '/api/mobile/profile',
    auth: true,
    name: 'Profile',
    method: 'GET',
  },
  {
    description: 'Update Current Profile',
    route: '/api/mobile/profile',
    auth: true,
    name: 'Profile',
    method: 'POST',
  },

  // Rent
  {
    description: 'Create New Rent',
    route: '/api/mobile/rents',
    auth: true,
    name: 'Rent',
    method: 'POST',
  },
  {
    description: 'Get Rents',
    route: '/api/mobile/rents',
    auth: true,
    name: 'Rent',
    method: 'GET',
  },
  {
    description: 'Get Rent Details',
    route: '/api/mobile/rents/:id',
    auth: true,
    name: 'Rent',
    method: 'GET',
  },
  {
    description: 'Update Rent',
    route: '/api/mobile/rents/:id',
    auth: true,
    name: 'Rent',
    method: 'PUT',
  },
  {
    description: 'Get My Rents',
    route: '/api/mobile/rents/me',
    auth: true,
    name: 'Rent',
    method: 'GET',
  },
  {
    description: 'Cancel or Delete Rent',
    route: '/api/mobile/rents/:id',
    auth: true,
    name: 'Rent',
    method: 'DELETE',
  },

  // Market

  // Product
  {
    description: 'Create Product',
    route: '/api/mobile/market/products',
    auth: true,
    name: 'Product',
    method: 'POST',
  },
  {
    description: 'Update Product',
    route: '/api/mobile/market/products/:id',
    auth: true,
    name: 'Product',
    method: 'PUT',
  },
  {
    description: 'Get Products',
    route: '/api/mobile/market/products',
    auth: true,
    name: 'Product',
    method: 'GET',
  },
  {
    description: 'Delete Product',
    route: '/api/mobile/market/products/:id',
    auth: true,
    name: 'Product',
    method: 'DELETE',
  },
  {
    description: 'Create Bulk Product',
    route: '/api/mobile/market/products/bulk',
    auth: true,
    name: 'Product',
    method: 'POST',
  },
  {
    description: 'Get My Products',
    route: '/api/mobile/market/products/me',
    auth: true,
    name: 'Product',
    method: 'GET',
  },

  // Order
  {
    description: 'Get Orders',
    route: '/api/mobile/market/orders',
    auth: true,
    name: 'Order',
    method: 'GET',
  },
  {
    description: 'Create Orders',
    route: '/api/mobile/market/orders',
    auth: true,
    name: 'Order',
    method: 'POST',
  },
]

export { roles, users, profile, permissions, clientPermissions }
