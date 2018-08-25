Rails.application.routes.draw do
  devise_for :users,
    path: 'admin',
    path_names: {
      sign_in: 'login',
      sign_out: 'logout'
    },
    controllers: {
      sessions: 'admin/sessions',
      passwords: 'admin/passwords'
    },
    skip: [:registration]

  root 'properties#index'

  resources :properties do
    resources :property_reports, only: [:index], as: 'reports'
  end

  namespace :admin do
    root to: 'orders#index'

    resources :orders, only: [:index]
    resources :users, except: [:show]
  end
end
