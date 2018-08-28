class PropertiesController < ApplicationController
  before_action :set_property, only: [:edit, :update, :destroy]
  before_action :clean_property_params, only: [:create, :update]

  def index
    @properties = Property.all.order(created_at: :desc)
  end

  def new
    @property = Property.new
    render :form
  end

  def create
    create_customer if params[:customer].present? and not customer_signed_in?
    Property.create property_params
    redirect_to after_form_path, flash: { notice: 'Form was saved successfully' }
  end

  def edit
    render :form
  end

  def update
    @property.update_attributes property_params
    redirect_to after_form_path, flash: { notice: 'Form was saved successfully' }
  end

  def destroy
    @property.destroy
    redirect_to after_form_path
  end

    private

      def set_property
        @property = Property.find params[:id]
      end

      def clean_property_params
        unless params.dig(:property, :data, :compensation, :decide) == 'true'
          params[:property][:data].delete :payment
        end

        if params.dig(:property, :data, :compensation, :decide) == 'none'
          params[:property][:data].delete :payment_details
        end

        case params[:submit_type]
        when 'soft' then params[:property][:validated] = false
        when 'hard' then params[:property][:validated] = true
        end
      end

      def create_customer
        @customer = Customer.create customer_params
        sign_in @customer, scope: :customer
        params[:property][:customer_id] = @customer.id
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
