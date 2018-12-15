class PropertiesController < ApplicationController
  include PropertyParamsCleanup

  before_action :set_property, only: [:edit, :update, :destroy]
  before_action :property_params_cleanup, only: [:update]

  def index
    @properties = Property.all.order(created_at: :desc)
  end

  def new
    @property = Property.create customer: current_customer
    redirect_to edit_property_path @property
  end

  def edit
    render :form
  end

  def update
    @property.update_attributes property_params
    if request.xhr?
      render plain: 'ok'
    else
      redirect_to after_form_path, flash: { notice: 'Form was saved successfully' }
    end
  end

  def destroy
    @property.destroy
    redirect_to after_form_path
  end

    private

      def set_property
        @property =
          if params[:id].present?
            Property.find params[:id]
          elsif customer_signed_in?
            current_customer.properties.first
          end
      end

      def create_customer
        @customer = Customer.create customer_params
        sign_in @customer, scope: :customer
      end

      def set_customer
        params[:property][:customer_id] = current_customer.id
      end

      def after_form_path
        if customer_signed_in?
          customers_root_path
        else
          properties_path
        end
      end

      def property_params
        params
          .require(:property)
          .permit!
      end

      def customer_params
        params
          .require(:customer)
          .permit([:email, :password])
      end
end
