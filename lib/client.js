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
    // Your code goes here
    console.log("Here");
    function formatResults(results) {
        var count = 0;
        var elements = '<div class="row card-container">';
        $.each(results, function(idx, obj) {
            var html = `
                <div class="col-md-3 col">
                    <div class="card">
                        <a href="javascript:void(0)" class="movieLink">
                        <input type="hidden" name="movie_id" value="${obj.id}">
                        <img src="http://image.tmdb.org/t/p/w185/${obj.poster_path}" alt="Avatar">
                        <div class="movie-content">
                            <h4> ${obj.title} </h4>
                            <p> ${obj.release_date} </p>
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

    function queryMovie() {
        console.log($('#movie_search').val());
        var query = $('#movie_search').val();
        if (!query) return;
        
        // Make a search request to server.
        $.ajax({
            url: 'http://localhost/discussimdb/search/' + query,
            type: 'GET',
            success: function(result) {
                console.log(result.page);
                if (result.results)
                    $('.movie_search_class').html(formatResults(result.results));
                
            },
            error: function(error) {
                console.log(`Error ${error}`);
            }
        });
    }

    $('body').on('click', '#movie_search_go', function(e) {
        queryMovie();
    });
    
    $('body').on('keyup', '#movie_search', function(e) {
        if (event.keyCode == 13) {
            queryMovie();
        }
    });

    $('body').on('click', 'a.movieLink', function(e) {
        e.preventDefault();
        console.log(this.href);
        var movieID = $(this).find("input").val();
        console.log("Movie id " + movieID);
        if (movieID) {
            $.ajax({
                url: 'http://localhost/discussimdb/category/add',
                type: 'POST',
                data : {'movie_id' : movieID},
                success: function(result) {
                    console.log(result);
                    if (result.slug) {
                        window.location.href = "/category/" + result.slug;
                    }
                },
                error: function(error) {
                    console.log(`Error ${error}`);
                }
            });
        }
    });
});