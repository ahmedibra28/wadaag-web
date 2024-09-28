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
  rent: 3,
  market: 4,
  report: 5,
  normal: 6,
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
    name: 'Payments',
    path: '/reports/payments',
    menu: 'reports',
    sort: sort.report,
    description: 'Payments page',
  },
  {
    name: 'Notifications',
    path: '/notifications',
    menu: 'normal',
    sort: sort.normal,
    description: 'Notifications page',
  },

  // Rents
  {
    name: 'Rents',
    path: '/rents',
    menu: 'rent',
    sort: sort.rent,
    description: 'Rents page',
  },
  {
    name: 'Rent Details',
    path: '/rents/[id]',
    menu: 'hidden',
    sort: sort.hidden,
    description: 'Rent details page',
  },
  // Market
  {
    name: 'Products',
    path: '/markets/products',
    menu: 'market',
    sort: sort.market,
    description: 'Products page',
  },
  {
    name: 'Product Details',
    path: '/markets/products/[id]',
    menu: 'hidden',
    sort: sort.hidden,
    description: 'Product details page',
  },
  {
    name: 'Orders',
    path: '/markets/orders',
    menu: 'market',
    sort: sort.market,
    description: 'Orders page',
  },
  {
    name: 'Order Transactions',
    path: '/markets/orders/[id]',
    menu: 'hidden',
    sort: sort.hidden,
    description: 'Order transactions page',
  },
  {
    name: 'Stores',
    path: '/markets/stores',
    menu: 'market',
    sort: sort.market,
    description: 'Stores page',
  },
  {
    name: 'Advertisements',
    path: '/markets/advertisements',
    menu: 'normal',
    sort: sort.normal,
    description: 'Advertisements page',
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

  // Rents
  {
    description: 'Get Rents',
    route: '/api/rents/rents',
    auth: true,
    name: 'Rent',
    method: 'GET',
  },
  {
    description: 'Approve Rent',
    route: '/api/rents/rents/:id',
    auth: true,
    name: 'Rent',
    method: 'PUT',
  },
  {
    description: 'Delete Rent',
    route: '/api/rents/rents/:id',
    auth: true,
    name: 'Rent',
    method: 'DELETE',
  },
  {
    description: 'Get Rent Details',
    route: '/api/rents/rents/:id',
    auth: true,
    name: 'Rent',
    method: 'GET',
  },

  // Market
  // Products
  {
    description: 'Get Products',
    route: '/api/markets/products',
    auth: true,
    name: 'Market',
    method: 'GET',
  },
  {
    description: 'Get Product Details',
    route: '/api/markets/products/:id',
    auth: true,
    name: 'Market',
    method: 'GET',
  },
  {
    description: 'Approve Product',
    route: '/api/markets/products/:id',
    auth: true,
    name: 'Market',
    method: 'PUT',
  },
  {
    description: 'Remove Product',
    route: '/api/markets/products/:id',
    auth: true,
    name: 'Market',
    method: 'DELETE',
  },
  // Orders
  {
    description: 'Get Orders',
    route: '/api/markets/orders',
    auth: true,
    name: 'Market',
    method: 'GET',
  },
  {
    description: 'Get Order Details',
    route: '/api/markets/orders/:id',
    auth: true,
    name: 'Market',
    method: 'GET',
  },
  {
    description: 'Remove Order',
    route: '/api/markets/orders/:id',
    auth: true,
    name: 'Market',
    method: 'DELETE',
  },
  // Stores
  {
    description: 'Get Stores',
    route: '/api/markets/stores',
    auth: true,
    name: 'Market',
    method: 'GET',
  },
  {
    description: 'Get Store Transactions',
    route: '/api/markets/stores/:id',
    auth: true,
    name: 'Market',
    method: 'GET',
  },
  // Advertisement
  {
    description: 'Get Advertisements',
    route: '/api/advertisements',
    auth: true,
    name: 'Advertisement',
    method: 'GET',
  },
  {
    description: 'Update Advertisements',
    route: '/api/advertisements/:id',
    auth: true,
    name: 'Advertisement',
    method: 'PUT',
  },

  // mobile -------------------------------------
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
    description: 'Search Products',
    route: '/api/mobile/market/products/search',
    auth: true,
    name: 'Product',
    method: 'GET',
  },
  {
    description: 'Search Store Products',
    route: '/api/mobile/market/products/stores/:id',
    auth: true,
    name: 'Product',
    method: 'GET',
  },
  {
    description: 'Get Product By Id',
    route: '/api/mobile/market/products/:id',
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

  // Advertisement
  {
    description: 'Get Advertisements',
    route: '/api/mobile/advertisements',
    auth: true,
    name: 'Advertisement',
    method: 'GET',
  },
  {
    description: 'Create Advertisement',
    route: '/api/mobile/advertisements',
    auth: true,
    name: 'Advertisement',
    method: 'POST',
  },

  // Rental User
  {
    description: 'Get Rental User',
    route: '/api/mobile/rents/user',
    auth: true,
    name: 'Rental User',
    method: 'GET',
  },
  {
    description: 'Update Rental User',
    route: '/api/mobile/rents/user/:id',
    auth: true,
    name: 'Rental User',
    method: 'PUT',
  },
  {
    description: 'Create Rental User',
    route: '/api/mobile/rents/user',
    auth: true,
    name: 'Rental User',
    method: 'POST',
  },

  // Market User
  {
    description: 'Get Market User',
    route: '/api/mobile/market/user',
    auth: true,
    name: 'Market User',
    method: 'GET',
  },
  {
    description: 'Update Market User',
    route: '/api/mobile/market/user/:id',
    auth: true,
    name: 'Market User',
    method: 'PUT',
  },
  {
    description: 'Create Market User',
    route: '/api/mobile/market/user',
    auth: true,
    name: 'Market User',
    method: 'POST',
  },
]

export { roles, users, profile, permissions, clientPermissions }

// db.permissions.insertMany([{
//   description: 'Get Market User',
//   route: '/api/mobile/market/user',
//   auth: true,
//   name: 'Market User',
//   method: 'GET',
// },
// {
//   description: 'Update Market User',
//   route: '/api/mobile/market/user/:id',
//   auth: true,
//   name: 'Market User',
//   method: 'PUT',
// },
// {
//   description: 'Create Market User',
//   route: '/api/mobile/market/user',
//   auth: true,
//   name: 'Market User',
//   method: 'POST',
// }])
