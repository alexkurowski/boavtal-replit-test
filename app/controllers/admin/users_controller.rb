class Admin::UsersController < Admin::MainController
  def index
    @users = User.order :created_at
  end

  def create
    @user = User.new user_params
    respond_to do |format|
      if @user.save
        format.js { render json: {location: admin_users_path}, status: :created }
      else
        format.js { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    @user = User.find params[:id]
    @user.update user_params

    respond_to do |format|
      format.html { redirect_to admin_users_path }
      format.js   { render plain: 'ok' }
    end
  end

  def destroy
    @user = User.find params[:id]
    @user.destroy

    respond_to do |format|
      format.html { redirect_to admin_users_path }
      format.xml  { head :ok }
    end
  end

    private

      def user_params
        params.require(:user).permit(%I[
          username
          email
          password
        ])
      end
end
