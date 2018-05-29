Rails.application.routes.draw do
  root 'properties#index'

  resources :properties, except: [:new] do
    resources :property_reports, only: [:index], as: 'reports'
  end
end
