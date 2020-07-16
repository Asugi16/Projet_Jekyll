# frozen_string_literal: true

module JekyllDataPages
    class Generator < Jekyll::Generator
        safe true
        priority :lowest
    
        # Main plugin action, called by Jekyll-core
        def generate(site)
            @site = site
            
            site.config['data_output'].each do |opt|

                opt['options'].each do |out|
                    name_key = out["name_from"]
                    out_path = out["path"]

                    site.data[opt['name']].each do |datum|
                        
                        name = datum[name_key]
                        path = "#{out_path}/#{name}.html"
                        @site.pages << make_page(path, :options => out, :datum => datum)

                    end
                end
            end
        end

        # Generates contents for a file
        def make_page(file_path, options: nil, datum: nil)
            PageWithoutAFile.new(@site, __dir__, "", file_path).tap do |file|
                file.content = ""
                file.data.merge!(datum)
                file.data.merge!(options['values'])

                options['dynamic_values'].each do |key, extract_key|
                    file.data.merge!(
                        key => datum[extract_key]
                    )
                end
                file.output
            end
        end
    end
end