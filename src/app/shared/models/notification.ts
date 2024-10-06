import { TypeToast } from "@shared/enums";

export class Notification {
    /**
     * Tipo do Toast, se é de sucesso, aviso ou erro
     */
    typeToast?: TypeToast;

    /**
     * Mensagem a ser exibida no Toast
     */
    message?: string;

    /**
     * Descrição mais detalhada da mensagem a ser exibida no Toast
     */
    description?: string;
}
