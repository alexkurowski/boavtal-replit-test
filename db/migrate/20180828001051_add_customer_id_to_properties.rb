class AddCustomerIdToProperties < ActiveRecord::Migration[5.0]
  def change
    add_column :properties, :customer_id, :integer
  end
end
