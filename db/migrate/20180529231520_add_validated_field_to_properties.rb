class AddValidatedFieldToProperties < ActiveRecord::Migration[5.0]
  def change
    add_column :properties, :validated, :boolean, default: false
  end
end
