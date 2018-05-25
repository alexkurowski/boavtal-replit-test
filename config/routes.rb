Rails.application.routes.draw do
  root 'properties#index'

  resources :properties, except: [:new]
end
