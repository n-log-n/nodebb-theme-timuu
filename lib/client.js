/*
	Hey there!

	This is the client file for your theme. If you need to do any client-side work in javascript,
	this is where it needs to go.

	You can listen for page changes by writing something like this:

	  $(window).on('action:ajaxify.end', function(data) {
		var	url = data.url;
		console.log('I am now at: ' + url);
	  });
*/

'use strict';

$(document).ready(function() { 
    var queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    var queries = queryString.split("&");
    
    var params = [];
    for (var i = 0; i < queries.length; i++)
    {
        kv = queries[i].split('=');
        params.push(kv[0]);
        params[kv[0]] = kv[1];
    }

    if ('owner' in params && 'title' in params && 'poster' in params) {
        app.alert({
            title: params['title'],
            message: `Jackpot! You searched for a ${media_type} that is new to this forum. Please help us add more posts.`,
            location: 'left-bottom',
            timeout: 9500,
            type: 'success',
            image: 'http://image.tmdb.org/t/p/w92' + params['poster']
        });
        
    }
   
    function formatResults(results) {
        var media_type = ajaxify.data.title == 'TV Shows' ? 'tvs' : 'movies';
        var count = 0;
        var elements = '<div class="row card-container">';
        $.each(results, function(idx, obj) {
            var title = obj.title
            var year = '1947';
            if (media_type == 'tvs') {
                title = obj.original_name;
                year = new Date(obj.first_air_date).getFullYear();
            } else {
                year = new Date(obj.release_date).getFullYear();
            }
            if (title.length > 15)
                title = title.substring(0, 15) + "...";

            var html = `
                <div class="col-md-3 col">
                    <div class="card">
                        <a href="javascript:void(0)" class="media_link">
                        <input type="hidden" name="media_id" value="${obj.id}">
                        <img src="http://image.tmdb.org/t/p/w185/${obj.poster_path}" alt="Avatar">
                        <div class="media-content">
                            <h4> ${title} </h4>
                            <p> <b>${year} </b> </p>
                        </div></a>
                    </div>
                </div>
            `;

            if (count != 0 && count % 4 == 0 ) 
                elements += '</div><div class="row">'
            
            elements += html;
            
            count++;
        });

        if (count != 0 && count % 4 != 0 )
            elements += '</div>';
        
        return elements;
    }

    function queryMedia() {
        var media_type = ajaxify.data.title == 'TV Shows' ? 'tvs' : 'movies';
        console.log(media_type);    
        var query = $('#media_modal_input').val().trim();
        if (!query) return;
        
        // Make a search request to server.
        $.ajax({
            url: '/discussimdb/search/' + media_type + '/' + query,
            type: 'GET',
            success: function(result) {
                console.log(result.results);
                if (result.results)
                    $('.media_search_class').html(formatResults(result.results));
                
            },
            error: function(error) {
                console.log(`Error ${error}`);
            }
        });
    }

    $('body').on('click', '#media_search_go', function(e) {
        queryMedia();
    });
    
    $('body').on('keyup', '#media_modal', function(e) {
        if (event.keyCode == 13) {
            queryMedia();
        }
    });

    $('body').on('click', 'a.media_link', function(e) {
        e.preventDefault();
        var media_type = ajaxify.data.title == 'TV Shows' ? 'tvs' : 'movies';
        var media_id = $(this).find("input").val();
        console.log("Media id " + media_id);
        console.log("Media type " + media_type);

        if (media_id) {
            $.ajax({
                url: '/discussimdb/category/add',
                type: 'POST',
                data : {'media_id' : media_id, 'media_type': media_type},
                success: function(result) {
                    console.log(result);
                    if (result.slug) {
                        params = ''
                        if (result.owner) {
                            params = `?owner=1&title=${result.title}&poster=${result.poster_path}`;
                        }
                        window.location.href = "/category/" + result.slug + params;
                    }
                },
                error: function(error) {
                    console.log(`Error ${error}`);
                }
            });
        }
    });
});