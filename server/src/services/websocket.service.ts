import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
  import { Server } from 'socket.io';
  
  @WebSocketGateway({ cors: true })
  export class WebSocketService {
    @WebSocketServer()
    server: Server;
  
    sendProcessingComplete() {
      this.server.emit('processingComplete', { message: 'Processamento concluído!' });
    }
  }
  