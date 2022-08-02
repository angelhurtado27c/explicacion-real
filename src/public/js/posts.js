class PostsResponsive {
	constructor() {
		this.columns_posts = document.getElementsByClassName('column_posts')
		this.posts = this.getPosts()
		this.version = ''
		this.windowResize()
		window.addEventListener('resize', this.windowResize)
	}


	getPosts() {
		const len = this.columns_posts[0].children.length
		const posts = []

		for (let i = 0; i < len; i++)
			for (let col = 0; col < 3; col++) {
				let post = this.columns_posts[col].children[i]
				if (post) posts.push(post)
				else break
			}

		return posts
	}


	windowResize = () => {
		const screen = window.innerWidth

		if (screen > 1000)
			this.desktop()
		else if (screen < 680)
			this.mobile()
		else
			this.tablet()
	}




	desktop() {
		if (this.version == 'desktop') return
		this.version = 'desktop'
		this.showColumnsPosts(3)
		this.distributePostInCols(3)
	}


	tablet() {
		if (this.version == 'tablet') return
		this.version = 'tablet'
		this.showColumnsPosts(2)
		this.distributePostInCols(2)
	}


	mobile() {
		if (this.version == 'mobile') return
		this.version = 'mobile'
		this.showColumnsPosts(1)
		this.distributePostInCols(1)
	}


	showColumnsPosts(cols) {
		for (let i_col = 0; i_col < cols; i_col++)
			this.columns_posts[i_col].style.display = 'block'
		for (let i_col = cols; i_col < 3; i_col++)
			this.columns_posts[i_col].style.display = 'none'
	}


	distributePostInCols(cols) {
		let i_col
		for (i_col = 0; i_col < cols; i_col++)
			this.columns_posts[i_col].innerHTML = ''

		const limit_cols = cols - 1
		i_col = 0
		for (let post of this.posts) {
			this.columns_posts[i_col].appendChild(post)
			i_col = i_col < limit_cols ? i_col+1 : 0
		}
	}
}


new PostsResponsive