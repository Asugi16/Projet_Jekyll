# frozen_string_literal: true

module JekyllDataPages
    class PageWithoutAFile < Jekyll::Page
      def read_yaml(*)
        @data ||= {}
      end
    end
  end