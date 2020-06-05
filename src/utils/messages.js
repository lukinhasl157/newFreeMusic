const messageStore = {
	ptBR: {
		memberIsNotOnVoiceChannel: 'Por favor, entre em um canal de voz primeiro!',
		botIsAlreadyOnVoiceChannel: 'Desculpe, eu já estou tocando música em outro canal de voz.',
		botNoPermissionConnect: 'Desculpe, eu não tenho permissão para entrar neste canal.',
		botNoPermissionSpeak: 'Desculpe, eu não tenho permissão para transmitir áudio neste canal.',
		noArguments: 'Por favor, insira o nome de uma música.',
		noVideoFound: 'Desculpe, eu não conseguir encontrar este vídeo.',
		musicSelectionCancelled: 'Seleção de músicas cancelada com sucesso!',
		isLiveStream: 'Desculpe, a música que você selecionou é uma live stream e não pode ser transmitida.',
		musicAlreadyInQueue: 'Desculpe, esta música já foi adicionada na fila.',
	},
  enUS: {
    memberIsNotOnVoiceChannel: 'Please, join a voice channel first!',
    botIsAlreadyOnVoiceChannel: 'Sorry, I am already playing music on another voice channel.',
    botNoPermissionConnect: 'Sorry, I don\'t have permission to join that voice channel.',
    botNoPermissionSpeak: 'Sorry, I don\'t have permission to play audio on that voice channel.',
    noArguments: 'Please, input the name of the song.',
    noVideoFound: 'Sorry, I could not find any video.',
    musicSelectionCancelled: 'Queue cancelled successfully!',
    isLiveStream: 'Sorry, the song you inputted is a livestream which I cannot play.',
    musicAlreadyInQueue: 'Sorry, that music was already added to the queue',
  }
};

module.exports = { messageStore };