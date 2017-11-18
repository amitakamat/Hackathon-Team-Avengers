<!DOCTYPE html>
<html>
<head>
  <% include ../partials/header.ejs %>
</head>

<body>
<div class="jumbotron text-center">
	<div class="container">
<h1>Statistics of the UrlShortener</h1>
<hr>
<h5>Domain Name and respective number of hits</h5>
<ul class="list-group">
<% for (var key in data) { %>
<div id="success" class="alert alert-success" 
  	<li class="list-group-item">
    		<%= data[key].domain %>
    		<span class="badge"><%= data[key].hits %></span>
  	</li>
  </div>
<% } %>

</ul>
<hr>
  <div><a type="button" class="btn btn-lg btn-primary" href="/"> Back to URL Shortener</a></div>
</div>
</div>
</body>
</html>