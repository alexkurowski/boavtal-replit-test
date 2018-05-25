Rails.application.routes.draw do
  root 'properties#index'

  resources :properties, except: [:index, :new]
end
