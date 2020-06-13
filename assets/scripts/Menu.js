class Menu {
	constructor() {
		this.items = [];
		this.structure = new Map();
		if (arguments.length > 0) {
			this.load(...arguments);
		}
		console.log(this);
	}
	load() {
		const args = [...arguments].filter(({ text, href }) => isset(text) && isset(href));
		let index = 0;
		for (const { text, href, target, rel, children, title } of args) {
			let currentIndex = index;
			let childrenIndexes = [];
			index = this.items.push(
				ecs({
					$: 'a',
					attr: {
						href: href,
						target: target,
						rel: rel,
						title: title,
					},
					_: text,
				})
			);
			if (children) {
				if (
					children instanceof Array &&
					children.filter(({ text, href }) => isset(text) && isset(href)).length > 0
				) {
					for (const { text, href, target, rel, title } of children) {
						childrenIndexes.push(index);
						index = this.items.push(
							ecs({
								$: 'a',
								attr: {
									href: href,
									target: target,
									rel: rel,
									title: title,
								},
								_: text,
							})
						);
					}
				}
			}
			this.structure.set(currentIndex, childrenIndexes);
		}
	}
	html() {
		return ecs({
			$: 'ul',
			class: ['menu'],
			_: [...this.structure.keys()].map(index => ({
				$: 'li',
				class: ['menu-item'],
				_: [
					this.items[index],
					{
						$: 'ul',
						class: ['sub-menu'],
						_: this.structure.get(index).map(index => ({
							$: 'li',
							class: ['sub-menu-item'],
							_: [this.items[index]],
						})),
					},
				],
			})),
		});
	}
}
