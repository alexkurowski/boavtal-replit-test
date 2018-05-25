class PropertiesController < ApplicationController
  before_action :set_property, only: [:edit, :update, :destroy]

  def index
    @properties = Property.all.order(created_at: :desc)
  end

  def create
    property = Property.create
    redirect_to edit_property_path property
  end

  def edit
  end

  def update
  end

  def destroy
  end

    private

      def set_property
        @property = Property.find params[:id]
      end
end
