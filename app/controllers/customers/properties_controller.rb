class Customers::PropertiesController < Customers::MainController
  def index
    @properties = Property
      .where(customer: current_customer)
      .order(created_at: :desc)
  end
end
