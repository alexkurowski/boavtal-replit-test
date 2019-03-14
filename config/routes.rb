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

  devise_for :customers,
    path: 'customer',
    path_names: {
      sign_in: 'login',
      sign_out: 'logout'
    },
    controllers: {
      sessions: 'customers/sessions',
      passwords: 'customers/passwords'
    },
    skip: [:registration]

  root 'properties#index'

  get '/home' => 'pages#home'

  get '/bodelningsavtal' => 'properties#new', as: :new_property

  resources :properties, except: [:new] do
    resources :property_reports, only: [:index], as: 'reports'
    get 'docx' => 'property_reports#docx', as: :reports_docx
  end

  resource :property, only: [:edit, :update, :destroy], as: :customers_property
  get '/property_report' => 'property_reports#index', as: :customers_property_report

  namespace :admin do
    root to: 'orders#index'

    resources :orders, only: [:index]
    resources :users, except: [:show]
  end

  namespace :customers, path: 'customer' do
    root to: 'properties#index'
  end
end
