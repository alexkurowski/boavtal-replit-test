class PropertiesController < ApplicationController
  before_action :set_property, only: [:edit, :update, :destroy]
  before_action :clean_property_params, only: [:update]

  def index
    @properties = Property.all.order(created_at: :desc)
  end

  def new
    @property = Property.create
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
      redirect_to after_update_path, flash: { notice: 'Form was saved successfully' }
    end
  end

  def destroy
    @property.destroy
    redirect_to after_destroy_path
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

      def clean_property_params
        unless params.dig(:property, :data, :compensation, :decide) == 'true'
          params[:property][:data].delete :payment
        end

        if params.dig(:property, :data, :compensation, :decide) == 'none'
          params[:property][:data].delete :payment_details
        end

        unless params.dig(:property, :data, :assets).blank?
          params.dig(:property, :data, :assets).each do |type, value|
            params[:property][:data][:assets][type].delete :template
          end
        end

        unless params.dig(:property, :data, :debts).blank?
          params.dig(:property, :data, :debts).each do |type, value|
            params[:property][:data][:debts][type].delete :template
          end
        end

        case params[:submit_type]
        when 'soft' then params[:property][:validated] = false
        when 'hard' then params[:property][:validated] = true
        end
      end

      def create_customer
        @customer = Customer.create customer_params
        sign_in @customer, scope: :customer
      end

      def set_customer
        params[:property][:customer_id] = current_customer.id
      end

      def after_update_path
        if @property&.validated?
          property_reports_path @property
        else
          if customer_signed_in?
            customers_root_path
          else
            properties_path
          end
        end
      end

      def after_destroy_path
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
