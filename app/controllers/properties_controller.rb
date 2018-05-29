class PropertiesController < ApplicationController
  before_action :set_property, only: [:edit, :update, :destroy]
  before_action :clean_property_params, only: [:update]

  def index
    @properties = Property.all.order(created_at: :desc)
  end

  def new
    @property = Property.new
    render :form
  end

  def create
    Property.create property_params
    redirect_to properties_path
  end

  def edit
    render :form
  end

  def update
    @property.update_attributes property_params
    redirect_to properties_path
  end

  def destroy
    @property.destroy
    redirect_to properties_path
  end

    private

      def set_property
        @property = Property.find params[:id]
      end

      def clean_property_params
        if params.dig(:property, :data, :compensation, :decide) == 'false'
          params[:property][:data].delete :payment
          params[:property][:data].delete :payment_details
        end

        case params[:submit_type]
        when 'soft' then params[:property][:validated] = false
        when 'hard' then params[:property][:validated] = true
        end
      end

      def property_params
        params
          .require(:property)
          .permit!
      end
end
