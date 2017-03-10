---
title: About
sidebarPartial: aboutSidebar
processTemplate: true
---

# About

Content here for about...


## Contributors

<div class="columns is-multiline contributors">
  <% data.contributors.forEach(function (contributor) { %>
  <div class="column is-one-quarter">
    <div class="contributor">
      <a target="_blank" href="<%= contributor.html_url %>">
        <img alt="<%= contributor.name %>" src="<%= contributor.avatar_url %>" />

        <h4 class="no-permalink"><%= contributor.name %></h4>
      </a>
    </div>
  </div>
  <% }) %>
</div>

More on [GitHub](https://github.com/Travix-International/frint/graphs/contributors).
