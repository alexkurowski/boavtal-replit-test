class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  before_action :authenticate

    private

      def authenticate
        authenticate_or_request_with_http_basic do |username, password|
          username == "foo" && password == "bar"
        end
      end
end
