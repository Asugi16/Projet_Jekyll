# frozen_string_literal: true

require "jekyll"
require "fileutils"
require_relative "jekyll-data-pages/generator.rb"

module JekyllDataPages
  autoload :PageWithoutAFile, "jekyll-data-pages/page-without-a-file.rb"
end