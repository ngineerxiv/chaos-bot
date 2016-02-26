docomo=""
slack=""

start:
	env DOCOMO_API_KEY=$(docomo) \
		env HUBOT_SLACK_TOKEN=$(slack) \
		./bin/hubot --adapter slack

start-local:
	env DOCOMO_API_KEY=$(docomo) \
		env HUBOT_SLACK_TOKEN=$(slack) \
		./bin/hubot

