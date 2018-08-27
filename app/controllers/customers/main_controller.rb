class Customers::MainController < ActionController::Base
  before_action :authenticate_customer!

  layout 'customer'
end
