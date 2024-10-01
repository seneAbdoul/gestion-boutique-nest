import cron from 'node-cron';
import { NotificationService } from './notification/notification.service';

export class ScheduledTasks {
  constructor(private readonly notificationService: NotificationService) {}

  // Planification d'une tâche pour vérifier les dettes toutes les 30 minutes
  public start() {
    cron.schedule('*/1 * * * *', async () => {
      console.log('Vérification des dettes arrivées à échéance...');
      const dueDebts = await this.notificationService.checkDueDebtsAndNotify();
      console.log(`${dueDebts.length} notifications envoyées.`);
    });
  }
}