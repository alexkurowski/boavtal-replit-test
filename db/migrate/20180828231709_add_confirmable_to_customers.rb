class AddConfirmableToCustomers < ActiveRecord::Migration[5.0]
  def change
    # Devise confirmable
    add_column :customers, :confirmation_token,   :string
    add_column :customers, :confirmed_at,         :datetime
    add_column :customers, :confirmation_sent_at, :datetime
    add_column :customers, :unconfirmed_email,    :string

    add_index :customers, :confirmation_token, unique: true
  end
end
