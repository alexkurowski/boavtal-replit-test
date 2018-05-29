Rails.application.routes.draw do
  root 'properties#index'

  resources :properties do
    resources :property_reports, only: [:index], as: 'reports'
  end
end
